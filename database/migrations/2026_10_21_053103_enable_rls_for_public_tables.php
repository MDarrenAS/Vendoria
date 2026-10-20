<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::connection()->getDriverName() !== 'pgsql') {
            return;
        }

        DB::unprepared(<<<'SQL'
            DO $rls$
            DECLARE
                table_record record;
                api_role text;
            BEGIN
                FOR table_record IN
                    SELECT schemaname, tablename
                    FROM pg_tables
                    WHERE schemaname = 'public'
                LOOP
                    EXECUTE format(
                        'ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY',
                        table_record.schemaname,
                        table_record.tablename
                    );
                END LOOP;

                FOREACH api_role IN ARRAY ARRAY['anon', 'authenticated'] LOOP
                    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = api_role) THEN
                        EXECUTE format(
                            'REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM %I',
                            api_role
                        );
                        EXECUTE format(
                            'REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM %I',
                            api_role
                        );
                        EXECUTE format(
                            'ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public REVOKE ALL PRIVILEGES ON TABLES FROM %I',
                            current_user,
                            api_role
                        );
                        EXECUTE format(
                            'ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public REVOKE ALL PRIVILEGES ON SEQUENCES FROM %I',
                            current_user,
                            api_role
                        );
                    END IF;
                END LOOP;
            END
            $rls$;
            SQL);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        throw new LogicException('This security migration cannot be rolled back automatically.');
    }
};
