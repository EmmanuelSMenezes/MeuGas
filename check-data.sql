SELECT 'administrator.administrator' as tabela, count(*) as registros FROM administrator.administrator
UNION ALL
SELECT 'authentication.user', count(*) FROM authentication."user"
UNION ALL
SELECT 'catalog.category', count(*) FROM catalog.category
UNION ALL
SELECT 'partner.partner', count(*) FROM partner.partner
UNION ALL
SELECT 'orders.orders', count(*) FROM orders.orders;
