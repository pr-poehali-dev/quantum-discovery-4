CREATE TABLE t_p98872536_quantum_discovery_4.user_roles (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO t_p98872536_quantum_discovery_4.user_roles (code, name, description) VALUES
    ('admin',      'Администратор',      'Управление пользователями, справочниками, системными параметрами'),
    ('coordinator','Координатор',        'Создание сессий, закрепление территорий, контроль данных'),
    ('observer',   'Полевой наблюдатель','Внесение первичных данных наблюдений'),
    ('expert',     'Эксперт-орнитолог', 'Проверка и подтверждение наблюдений'),
    ('analyst',    'Аналитик',           'Построение выборок, карт, графиков, индексов, экспорт'),
    ('viewer',     'Наблюдатель',        'Просмотр утверждённых данных без изменений');

CREATE TABLE t_p98872536_quantum_discovery_4.bird_species (
    id SERIAL PRIMARY KEY,
    latin_name VARCHAR(200) UNIQUE NOT NULL,
    russian_name VARCHAR(200) NOT NULL,
    english_name VARCHAR(200),
    order_name VARCHAR(100),
    family_name VARCHAR(100),
    is_rare BOOLEAN DEFAULT FALSE,
    is_protected BOOLEAN DEFAULT FALSE,
    red_book_status VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO t_p98872536_quantum_discovery_4.bird_species (latin_name, russian_name, english_name, order_name, family_name, is_rare, is_protected) VALUES
    ('Ciconia ciconia',      'Белый аист',          'White Stork',        'Аистообразные',    'Аистовые',    FALSE, FALSE),
    ('Ciconia nigra',        'Чёрный аист',         'Black Stork',        'Аистообразные',    'Аистовые',    TRUE,  TRUE),
    ('Aquila chrysaetos',    'Беркут',              'Golden Eagle',       'Ястребообразные',  'Ястребиные',  TRUE,  TRUE),
    ('Falco peregrinus',     'Сапсан',              'Peregrine Falcon',   'Соколообразные',   'Соколиные',   TRUE,  TRUE),
    ('Grus grus',            'Серый журавль',       'Common Crane',       'Журавлеобразные',  'Журавлиные',  FALSE, FALSE),
    ('Anser anser',          'Серый гусь',          'Greylag Goose',      'Гусеобразные',     'Утиные',      FALSE, FALSE),
    ('Cygnus cygnus',        'Лебедь-кликун',       'Whooper Swan',       'Гусеобразные',     'Утиные',      FALSE, TRUE),
    ('Ardea cinerea',        'Серая цапля',         'Grey Heron',         'Аистообразные',    'Цаплевые',    FALSE, FALSE),
    ('Pandion haliaetus',    'Скопа',               'Osprey',             'Ястребообразные',  'Скопиные',    TRUE,  TRUE),
    ('Haliaeetus albicilla', 'Орлан-белохвост',     'White-tailed Eagle', 'Ястребообразные',  'Ястребиные',  TRUE,  TRUE),
    ('Columba palumbus',     'Вяхирь',              'Common Wood Pigeon', 'Голубеобразные',   'Голубиные',   FALSE, FALSE),
    ('Turdus merula',        'Чёрный дрозд',        'Common Blackbird',   'Воробьинообразные','Дроздовые',   FALSE, FALSE),
    ('Parus major',          'Большая синица',      'Great Tit',          'Воробьинообразные','Синицевые',   FALSE, FALSE),
    ('Hirundo rustica',      'Деревенская ласточка','Barn Swallow',       'Воробьинообразные','Ласточковые', FALSE, FALSE),
    ('Luscinia luscinia',    'Обыкновенный соловей','Common Nightingale', 'Воробьинообразные','Мухоловковые',FALSE, FALSE);

CREATE TABLE t_p98872536_quantum_discovery_4.biotopes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO t_p98872536_quantum_discovery_4.biotopes (code, name) VALUES
    ('forest',   'Лес'), ('steppe',   'Степь'), ('wetland',  'Водно-болотные угодья'),
    ('river',    'Речные поймы'), ('coastal',  'Побережье'), ('agro',     'Агроландшафт'),
    ('urban',    'Урбанизированные территории'), ('mountain', 'Горные территории'),
    ('tundra',   'Тундра'), ('desert',   'Пустыни и полупустыни');

CREATE TABLE t_p98872536_quantum_discovery_4.habitat_zones (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO t_p98872536_quantum_discovery_4.habitat_zones (code, name) VALUES
    ('ground','На земле'), ('water','На воде'), ('low_veg','В низкой растительности'),
    ('shrub','В кустарнике'), ('tree_low','На дереве (низко)'), ('tree_high','На дереве (высоко)'),
    ('air_low','В воздухе (низко)'), ('air_mid','В воздухе (средне)'), ('air_high','В воздухе (высоко)');

CREATE TABLE t_p98872536_quantum_discovery_4.migration_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO t_p98872536_quantum_discovery_4.migration_types (code, name) VALUES
    ('spring','Весенняя миграция'), ('autumn','Осенняя миграция'),
    ('nomadic','Кочёвки'), ('resident','Оседлые'), ('wintering','Зимовка');

CREATE TABLE t_p98872536_quantum_discovery_4.migration_directions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL
);

INSERT INTO t_p98872536_quantum_discovery_4.migration_directions (code, name) VALUES
    ('N','С'), ('NE','СВ'), ('E','В'), ('SE','ЮВ'), ('S','Ю'), ('SW','ЮЗ'), ('W','З'), ('NW','СЗ');

CREATE TABLE t_p98872536_quantum_discovery_4.flock_forms (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO t_p98872536_quantum_discovery_4.flock_forms (code, name) VALUES
    ('single','Одиночная особь'), ('pair','Пара'),
    ('small','Мелкая группа (3–10)'), ('medium','Средняя стая (11–100)'),
    ('large','Крупная стая (101–1000)'), ('massive','Массовое скопление (>1000)');

CREATE TABLE t_p98872536_quantum_discovery_4.weather_conditions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO t_p98872536_quantum_discovery_4.weather_conditions (code, name) VALUES
    ('clear','Ясно'), ('cloudy','Облачно'), ('overcast','Пасмурно'),
    ('rain','Дождь'), ('snow','Снег'), ('fog','Туман'),
    ('wind','Сильный ветер'), ('storm','Шторм');

CREATE TABLE t_p98872536_quantum_discovery_4.monitoring_territories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE,
    territory_type VARCHAR(50),
    description TEXT,
    geom_wkt TEXT,
    area_ha NUMERIC(12,2),
    is_wetland BOOLEAN DEFAULT FALSE,
    wetland_status VARCHAR(100),
    created_by INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE t_p98872536_quantum_discovery_4.observation_polygons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    territory_id INTEGER REFERENCES t_p98872536_quantum_discovery_4.monitoring_territories(id),
    polygon_type VARCHAR(50),
    geom_wkt TEXT,
    area_ha NUMERIC(10,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE t_p98872536_quantum_discovery_4.counting_sessions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(300) NOT NULL,
    session_code VARCHAR(100) UNIQUE,
    territory_id INTEGER REFERENCES t_p98872536_quantum_discovery_4.monitoring_territories(id),
    session_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'planned',
    start_date DATE NOT NULL,
    end_date DATE,
    coordinator_id INTEGER,
    description TEXT,
    weather_code VARCHAR(50) REFERENCES t_p98872536_quantum_discovery_4.weather_conditions(code),
    wind_speed_ms NUMERIC(5,1),
    temperature_c NUMERIC(5,1),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO t_p98872536_quantum_discovery_4.counting_sessions (name, session_code, session_type, status, start_date, end_date, coordinator_id, description, weather_code, temperature_c) VALUES
    ('Весенняя миграция 2024 — Поволжье', 'SS-2024-001', 'route',      'active',    '2024-04-01', '2024-05-31', 1, 'Маршрутный учёт в период весенней миграции', 'clear',   12.5),
    ('Гнездовой период 2024 — Лесостепь', 'SS-2024-002', 'stationary', 'active',    '2024-05-15', '2024-07-15', 1, 'Стационарные точки в гнездовой сезон',      'cloudy',  18.0),
    ('Осенняя миграция 2024 — Кавказ',    'SS-2024-003', 'route',      'completed', '2024-09-01', '2024-10-31', 1, 'Учёт хищных птиц на Кавказском перевале',  'clear',    8.0),
    ('Зимние скопления 2024 — Юг России', 'SS-2024-004', 'aggregation','planned',   '2024-12-01', '2025-02-28', 1, 'Учёт зимующих птиц в дельте реки',         'overcast', -2.0),
    ('Водно-болотный учёт ВБУ-1',         'SS-2024-005', 'stationary', 'active',    '2024-06-01', '2024-06-30', 1, 'Учёт птиц водно-болотных угодий',           'clear',   22.0);

CREATE TABLE t_p98872536_quantum_discovery_4.session_observers (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES t_p98872536_quantum_discovery_4.counting_sessions(id),
    user_id INTEGER NOT NULL,
    role_in_session VARCHAR(50),
    assigned_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE t_p98872536_quantum_discovery_4.observation_records (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES t_p98872536_quantum_discovery_4.counting_sessions(id),
    species_id INTEGER NOT NULL REFERENCES t_p98872536_quantum_discovery_4.bird_species(id),
    observed_at TIMESTAMPTZ NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    biotope_id INTEGER REFERENCES t_p98872536_quantum_discovery_4.biotopes(id),
    habitat_zone_id INTEGER REFERENCES t_p98872536_quantum_discovery_4.habitat_zones(id),
    distance_m NUMERIC(8,1),
    map_point_number INTEGER,
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    polygon_id INTEGER REFERENCES t_p98872536_quantum_discovery_4.observation_polygons(id),
    territory_id INTEGER REFERENCES t_p98872536_quantum_discovery_4.monitoring_territories(id),
    migration_type_id INTEGER REFERENCES t_p98872536_quantum_discovery_4.migration_types(id),
    migration_direction_id INTEGER REFERENCES t_p98872536_quantum_discovery_4.migration_directions(id),
    flock_form_id INTEGER REFERENCES t_p98872536_quantum_discovery_4.flock_forms(id),
    altitude_m NUMERIC(6,1),
    comment TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    rejection_reason TEXT,
    expert_comment TEXT,
    author_id INTEGER NOT NULL DEFAULT 1,
    expert_id INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_obs_species  ON t_p98872536_quantum_discovery_4.observation_records(species_id);
CREATE INDEX idx_obs_session  ON t_p98872536_quantum_discovery_4.observation_records(session_id);
CREATE INDEX idx_obs_status   ON t_p98872536_quantum_discovery_4.observation_records(status);
CREATE INDEX idx_obs_observed ON t_p98872536_quantum_discovery_4.observation_records(observed_at);
CREATE INDEX idx_obs_coords   ON t_p98872536_quantum_discovery_4.observation_records(latitude, longitude);

INSERT INTO t_p98872536_quantum_discovery_4.observation_records (session_id, species_id, observed_at, count, biotope_id, habitat_zone_id, distance_m, latitude, longitude, migration_type_id, flock_form_id, status, author_id) VALUES
    (1, 5,  '2024-04-15 08:30:00+03', 47,  3, 8, 120.0, 52.1234, 46.5678, 1, 5, 'confirmed', 1),
    (1, 6,  '2024-04-16 07:15:00+03', 312, 3, 7, 80.0,  52.2341, 46.6789, 1, 6, 'confirmed', 1),
    (1, 3,  '2024-04-17 09:00:00+03', 2,   1, 9, 350.0, 52.3456, 46.7890, 1, 1, 'confirmed', 1),
    (2, 1,  '2024-05-20 10:00:00+03', 3,   1, 3, 50.0,  52.4567, 46.8901, 4, 2, 'confirmed', 1),
    (2, 12, '2024-05-21 06:45:00+03', 8,   1, 5, 30.0,  52.5678, 46.9012, 4, 3, 'submitted', 1),
    (3, 10, '2024-09-10 11:00:00+03', 1,   5, 9, 500.0, 43.1234, 43.5678, 2, 1, 'confirmed', 1),
    (3, 4,  '2024-09-11 12:30:00+03', 1,   5, 9, 200.0, 43.2345, 43.6789, 2, 1, 'confirmed', 1),
    (5, 8,  '2024-06-05 07:00:00+03', 12,  3, 2, 40.0,  51.9876, 46.4321, 4, 4, 'confirmed', 1),
    (1, 9,  '2024-04-20 09:45:00+03', 2,   3, 7, 180.0, 52.0987, 46.5432, 1, 1, 'needs_clarification', 1),
    (2, 2,  '2024-06-01 08:00:00+03', 1,   1, 5, 120.0, 52.6789, 47.0123, 4, 1, 'draft', 1);

CREATE TABLE t_p98872536_quantum_discovery_4.route_observation_params (
    id SERIAL PRIMARY KEY,
    observation_id INTEGER UNIQUE NOT NULL REFERENCES t_p98872536_quantum_discovery_4.observation_records(id),
    route_name VARCHAR(200),
    route_length_km NUMERIC(8,2),
    strip_width_m NUMERIC(6,1),
    transect_number INTEGER,
    segment_number INTEGER,
    walking_speed_kmh NUMERIC(4,1)
);

CREATE TABLE t_p98872536_quantum_discovery_4.stationary_observation_params (
    id SERIAL PRIMARY KEY,
    observation_id INTEGER UNIQUE NOT NULL REFERENCES t_p98872536_quantum_discovery_4.observation_records(id),
    point_name VARCHAR(200),
    observation_duration_min INTEGER,
    radius_m NUMERIC(6,1),
    azimuth_deg NUMERIC(5,1)
);

CREATE TABLE t_p98872536_quantum_discovery_4.aggregation_params (
    id SERIAL PRIMARY KEY,
    observation_id INTEGER UNIQUE NOT NULL REFERENCES t_p98872536_quantum_discovery_4.observation_records(id),
    roost_type VARCHAR(100),
    aggregation_area_ha NUMERIC(8,2),
    density_per_ha NUMERIC(8,2),
    is_breeding BOOLEAN DEFAULT FALSE,
    nest_count INTEGER
);

CREATE TABLE t_p98872536_quantum_discovery_4.audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL,
    user_id INTEGER,
    old_data JSONB,
    new_data JSONB,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_table ON t_p98872536_quantum_discovery_4.audit_log(table_name, record_id);
CREATE INDEX idx_audit_user  ON t_p98872536_quantum_discovery_4.audit_log(user_id);
CREATE INDEX idx_audit_time  ON t_p98872536_quantum_discovery_4.audit_log(changed_at);
