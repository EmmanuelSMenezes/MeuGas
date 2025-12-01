using System;
using Npgsql;

namespace RunMigration
{
    class Program
    {
        static void Main(string[] args)
        {
            // Conexão com banco de produção
            var connectionString = "Host=35.172.113.118;Port=5432;Username=postgres;Password=Pam9628#d;Database=pam;";
            
            Console.WriteLine("🔄 Executando migration: Allow NULL in document field...");
            
            try
            {
                using (var connection = new NpgsqlConnection(connectionString))
                {
                    connection.Open();
                    Console.WriteLine("✅ Conectado ao banco de dados de produção");
                    
                    // Executar migration
                    var migrationSql = @"
                        ALTER TABLE authentication.profile 
                        ALTER COLUMN document DROP NOT NULL;
                        
                        COMMENT ON COLUMN authentication.profile.document IS 'CPF ou CNPJ do usuário. Pode ser NULL para usuários criados via OTP que ainda não forneceram documento.';
                    ";
                    
                    using (var command = new NpgsqlCommand(migrationSql, connection))
                    {
                        command.ExecuteNonQuery();
                        Console.WriteLine("✅ Migration executada com sucesso!");
                    }
                    
                    // Verificar alteração
                    var verifySql = @"
                        SELECT 
                            column_name, 
                            data_type, 
                            is_nullable,
                            column_default
                        FROM information_schema.columns
                        WHERE table_schema = 'authentication' 
                          AND table_name = 'profile' 
                          AND column_name = 'document';
                    ";
                    
                    using (var command = new NpgsqlCommand(verifySql, connection))
                    using (var reader = command.ExecuteReader())
                    {
                        Console.WriteLine("\n📊 Verificação da coluna 'document':");
                        while (reader.Read())
                        {
                            Console.WriteLine($"  - Column: {reader["column_name"]}");
                            Console.WriteLine($"  - Type: {reader["data_type"]}");
                            Console.WriteLine($"  - Nullable: {reader["is_nullable"]}");
                            Console.WriteLine($"  - Default: {reader["column_default"]}");
                        }
                    }
                    
                    connection.Close();
                    Console.WriteLine("\n✅ Migration concluída com sucesso!");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"\n❌ Erro ao executar migration: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                Environment.Exit(1);
            }
        }
    }
}

