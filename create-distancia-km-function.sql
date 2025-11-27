-- Criar função distancia_km para calcular distância em km entre coordenadas
CREATE OR REPLACE FUNCTION logistics.distancia_km(lat1 numeric, lng1 numeric, lat2 numeric, lng2 numeric) 
RETURNS double precision
LANGUAGE sql IMMUTABLE
AS $$
    SELECT 6371 * acos(
        sin( radians($1) ) * sin( radians( $3 ))
          + cos( radians($1) ) * cos( radians( $3 )) * cos(radians($4) - radians($2))  )
    as distance;
$$;

-- Alterar owner para postgres
ALTER FUNCTION logistics.distancia_km(lat1 numeric, lng1 numeric, lat2 numeric, lng2 numeric) OWNER TO postgres;

-- Testar a função
SELECT logistics.distancia_km(-23.5505, -46.6333, -23.5629, -46.6544) as distancia_km;

