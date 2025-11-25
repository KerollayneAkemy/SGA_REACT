# Configuração do Supabase para SGA_REACT

## 1. Configuração Inicial

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Copie a URL e a chave anônima do projeto
4. Substitua no arquivo `src/lib/supabase.js`:
   ```javascript
   const supabaseUrl = 'SUA_URL_DO_SUPABASE'
   const supabaseKey = 'SUA_CHAVE_ANONIMA_DO_SUPABASE'
   ```

## 2. Configuração do Banco de Dados

Execute os seguintes comandos SQL no editor SQL do Supabase:

### Tabela de Perfis de Usuário
```sql
-- Criar tabela de perfis
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT,
  role TEXT DEFAULT 'aluno' CHECK (role IN ('aluno', 'professor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seu próprio perfil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Política para usuários atualizarem apenas seu próprio perfil
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'aluno')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Tabela de Mensagens de Contato
```sql
-- Criar tabela de mensagens de contato
CREATE TABLE mensagens_contato (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  lida BOOLEAN DEFAULT FALSE
);

-- Habilitar RLS
ALTER TABLE mensagens_contato ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de mensagens
CREATE POLICY "Anyone can insert messages" ON mensagens_contato
  FOR INSERT WITH CHECK (true);

-- Política para admins verem todas as mensagens
CREATE POLICY "Admins can view all messages" ON mensagens_contato
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
```

## 3. Configuração de Autenticação

1. No painel do Supabase, vá para Authentication > Settings
2. Configure o Site URL para: `http://localhost:5173` (desenvolvimento)
3. Adicione URLs de redirecionamento se necessário

## 4. Funcionalidades Implementadas

### Autenticação
- ✅ Cadastro de usuários com roles (aluno, professor, admin)
- ✅ Login com email e senha
- ✅ Logout
- ✅ Redirecionamento baseado no tipo de usuário

### Painéis por Tipo de Usuário
- ✅ **Aluno**: Visualiza disciplinas e notas, edita perfil
- ✅ **Professor**: Gerencia disciplinas
- ✅ **Admin**: Gerencia cursos, disciplinas e visualiza mensagens

### Sistema de Contato
- ✅ Formulário de contato salva mensagens no banco
- ✅ Admins podem visualizar mensagens no painel

## 5. Próximos Passos

Para completar a implementação:

1. Configure as credenciais do Supabase
2. Execute os comandos SQL no banco
3. Teste o cadastro e login
4. Verifique os painéis por tipo de usuário
5. Teste o envio de mensagens de contato