import { useState } from "react"
import OrnithologyLayout from "@/components/OrnithologyLayout"
import { STATUS_BADGE } from "@/components/OrnithologyLayout"
import Icon from "@/components/ui/icon"
import { Link } from "react-router-dom"

const OBSERVATIONS = [
  // Поволжье — SS-2024-001
  { id: 1,   species: "Серый журавль",             latin: "Grus grus",              count: 47,  status: "confirmed",           session: "SS-2024-001", date: "15.04.2024 08:30", biotope: "Водно-болотные угодья", lat: 52.1234, lon: 46.5678, rare: false, flock: "Крупная стая" },
  { id: 2,   species: "Серый гусь",               latin: "Anser anser",            count: 312, status: "confirmed",           session: "SS-2024-001", date: "16.04.2024 07:15", biotope: "Водно-болотные угодья", lat: 52.2341, lon: 46.6789, rare: false, flock: "Массовое скопление" },
  { id: 3,   species: "Беркут",                   latin: "Aquila chrysaetos",      count: 2,   status: "confirmed",           session: "SS-2024-001", date: "17.04.2024 09:00", biotope: "Лес",                   lat: 52.3456, lon: 46.7890, rare: true,  flock: "Одиночная особь" },
  { id: 9,   species: "Скопа",                    latin: "Pandion haliaetus",      count: 2,   status: "needs_clarification", session: "SS-2024-001", date: "20.04.2024 09:45", biotope: "Водно-болотные угодья", lat: 52.0987, lon: 46.5432, rare: true,  flock: "Одиночная особь" },
  // Гнездовой период — SS-2024-002
  { id: 4,   species: "Белый аист",               latin: "Ciconia ciconia",        count: 3,   status: "confirmed",           session: "SS-2024-002", date: "20.05.2024 10:00", biotope: "Лес",                   lat: 52.4567, lon: 46.8901, rare: false, flock: "Пара" },
  { id: 5,   species: "Чёрный дрозд",             latin: "Turdus merula",          count: 8,   status: "submitted",           session: "SS-2024-002", date: "21.05.2024 06:45", biotope: "Лес",                   lat: 52.5678, lon: 46.9012, rare: false, flock: "Мелкая группа" },
  { id: 10,  species: "Чёрный аист",              latin: "Ciconia nigra",          count: 1,   status: "draft",               session: "SS-2024-002", date: "01.06.2024 08:00", biotope: "Лес",                   lat: 52.6789, lon: 47.0123, rare: true,  flock: "Одиночная особь" },
  // Осенняя миграция — SS-2024-003 (Кавказ)
  { id: 6,   species: "Орлан-белохвост",          latin: "Haliaeetus albicilla",   count: 1,   status: "confirmed",           session: "SS-2024-003", date: "10.09.2024 11:00", biotope: "Побережье",             lat: 43.1234, lon: 43.5678, rare: true,  flock: "Одиночная особь" },
  { id: 7,   species: "Сапсан",                   latin: "Falco peregrinus",       count: 1,   status: "confirmed",           session: "SS-2024-003", date: "11.09.2024 12:30", biotope: "Побережье",             lat: 43.2345, lon: 43.6789, rare: true,  flock: "Одиночная особь" },
  { id: 21,  species: "Болотный лунь",            latin: "Circus aeruginosus",     count: 4,   status: "confirmed",           session: "SS-2024-003", date: "05.09.2024 08:00", biotope: "Агроландшафт",          lat: 45.050,  lon: 38.970,  rare: false, flock: "Мелкая группа" },
  { id: 22,  species: "Полевой лунь",             latin: "Circus cyaneus",         count: 2,   status: "confirmed",           session: "SS-2024-003", date: "05.09.2024 08:30", biotope: "Степь",                 lat: 44.980,  lon: 39.120,  rare: false, flock: "Пара" },
  { id: 23,  species: "Балобан",                  latin: "Falco cherrug",          count: 1,   status: "confirmed",           session: "SS-2024-003", date: "06.09.2024 09:00", biotope: "Горные территории",     lat: 44.730,  lon: 38.580,  rare: true,  flock: "Одиночная особь" },
  { id: 24,  species: "Серебристая чайка",        latin: "Larus argentatus",       count: 47,  status: "confirmed",           session: "SS-2024-003", date: "10.09.2024 08:00", biotope: "Побережье",             lat: 44.650,  lon: 38.310,  rare: false, flock: "Крупная стая" },
  { id: 25,  species: "Большой баклан",           latin: "Phalacrocorax carbo",    count: 120, status: "confirmed",           session: "SS-2024-003", date: "11.09.2024 09:00", biotope: "Побережье",             lat: 44.710,  lon: 38.250,  rare: false, flock: "Массовое скопление" },
  { id: 26,  species: "Большой кроншнеп",         latin: "Numenius arquata",       count: 1,   status: "confirmed",           session: "SS-2024-003", date: "09.09.2024 07:30", biotope: "Побережье",             lat: 44.820,  lon: 38.920,  rare: true,  flock: "Одиночная особь" },
  { id: 27,  species: "Серая ворона",             latin: "Corvus cornix",          count: 8,   status: "submitted",           session: "SS-2024-003", date: "13.09.2024 08:15", biotope: "Урбанизированные",      lat: 45.040,  lon: 39.010,  rare: false, flock: "Мелкая группа" },
  // ВБУ — SS-2024-005
  { id: 8,   species: "Серая цапля",              latin: "Ardea cinerea",          count: 12,  status: "confirmed",           session: "SS-2024-005", date: "05.06.2024 07:00", biotope: "Водно-болотные угодья", lat: 51.9876, lon: 46.4321, rare: false, flock: "Средняя стая" },
  // Московская область — SS-2024-002
  { id: 31,  species: "Домовый воробей",          latin: "Passer domesticus",      count: 14,  status: "confirmed",           session: "SS-2024-002", date: "10.05.2024 07:20", biotope: "Урбанизированные",      lat: 55.812,  lon: 37.221,  rare: false, flock: "Средняя стая" },
  { id: 32,  species: "Серая ворона",             latin: "Corvus cornix",          count: 8,   status: "confirmed",           session: "SS-2024-002", date: "10.05.2024 07:35", biotope: "Урбанизированные",      lat: 55.799,  lon: 37.245,  rare: false, flock: "Мелкая группа" },
  { id: 33,  species: "Ворон",                    latin: "Corvus corax",           count: 2,   status: "confirmed",           session: "SS-2024-002", date: "11.05.2024 08:00", biotope: "Лес",                   lat: 55.760,  lon: 37.190,  rare: false, flock: "Пара" },
  { id: 34,  species: "Зелёный дятел",           latin: "Picus viridis",          count: 1,   status: "confirmed",           session: "SS-2024-002", date: "12.05.2024 09:15", biotope: "Урбанизированные",      lat: 55.834,  lon: 37.612,  rare: false, flock: "Одиночная особь" },
  { id: 35,  species: "Большой пёстрый дятел",  latin: "Dendrocopos major",      count: 3,   status: "confirmed",           session: "SS-2024-002", date: "13.05.2024 10:00", biotope: "Лес",                   lat: 55.745,  lon: 36.892,  rare: false, flock: "Пара" },
  { id: 36,  species: "Чёрный дятел",            latin: "Dryocopus martius",      count: 1,   status: "confirmed",           session: "SS-2024-002", date: "14.05.2024 08:30", biotope: "Лес",                   lat: 55.680,  lon: 36.780,  rare: false, flock: "Одиночная особь" },
  { id: 37,  species: "Филин",                   latin: "Bubo bubo",              count: 1,   status: "confirmed",           session: "SS-2024-002", date: "15.05.2024 21:40", biotope: "Лес",                   lat: 55.720,  lon: 37.050,  rare: false, flock: "Одиночная особь" },
  { id: 38,  species: "Глухарь",                 latin: "Tetrao urogallus",       count: 4,   status: "confirmed",           session: "SS-2024-002", date: "16.05.2024 05:30", biotope: "Лес",                   lat: 55.810,  lon: 37.330,  rare: false, flock: "Пара" },
  { id: 39,  species: "Тетерев",                 latin: "Lyrurus tetrix",         count: 12,  status: "confirmed",           session: "SS-2024-002", date: "17.05.2024 06:00", biotope: "Степь",                 lat: 55.650,  lon: 37.120,  rare: false, flock: "Средняя стая" },
  // Ленинградская область — SS-2024-001
  { id: 41,  species: "Серая куропатка",          latin: "Perdix perdix",          count: 23,  status: "confirmed",           session: "SS-2024-001", date: "20.04.2024 06:45", biotope: "Речные поймы",          lat: 59.932,  lon: 30.214,  rare: false, flock: "Средняя стая" },
  { id: 42,  species: "Перепел",                  latin: "Coturnix coturnix",      count: 2,   status: "confirmed",           session: "SS-2024-001", date: "20.04.2024 07:10", biotope: "Степь",                 lat: 59.880,  lon: 29.560,  rare: false, flock: "Пара" },
  { id: 43,  species: "Чибис",                    latin: "Vanellus vanellus",      count: 31,  status: "confirmed",           session: "SS-2024-001", date: "21.04.2024 08:00", biotope: "Водно-болотные угодья", lat: 60.120,  lon: 30.450,  rare: false, flock: "Крупная стая" },
  { id: 44,  species: "Озёрная чайка",           latin: "Larus ridibundus",       count: 8,   status: "confirmed",           session: "SS-2024-001", date: "22.04.2024 09:30", biotope: "Водно-болотные угодья", lat: 59.960,  lon: 30.810,  rare: false, flock: "Мелкая группа" },
  { id: 45,  species: "Речная крачка",            latin: "Sterna hirundo",         count: 5,   status: "confirmed",           session: "SS-2024-001", date: "23.04.2024 07:45", biotope: "Водно-болотные угодья", lat: 60.050,  lon: 30.320,  rare: false, flock: "Мелкая группа" },
  { id: 46,  species: "Обыкновенный зимородок",  latin: "Alcedo atthis",          count: 1,   status: "confirmed",           session: "SS-2024-001", date: "28.04.2024 07:30", biotope: "Речные поймы",          lat: 59.990,  lon: 30.680,  rare: false, flock: "Одиночная особь" },
  { id: 47,  species: "Обыкновенный канюк",       latin: "Buteo buteo",            count: 1,   status: "confirmed",           session: "SS-2024-001", date: "25.04.2024 09:00", biotope: "Лес",                   lat: 59.870,  lon: 29.780,  rare: false, flock: "Одиночная особь" },
  { id: 48,  species: "Перепелятник",             latin: "Accipiter nisus",        count: 2,   status: "confirmed",           session: "SS-2024-001", date: "26.04.2024 10:00", biotope: "Лес",                   lat: 60.080,  lon: 30.580,  rare: false, flock: "Пара" },
  { id: 49,  species: "Неясыть серая",            latin: "Strix aluco",            count: 1,   status: "submitted",           session: "SS-2024-001", date: "27.04.2024 22:00", biotope: "Лес",                   lat: 59.820,  lon: 29.420,  rare: false, flock: "Одиночная особь" },
  // Западная Сибирь — SS-2024-001
  { id: 51,  species: "Тетеревятник",             latin: "Accipiter gentilis",     count: 1,   status: "confirmed",           session: "SS-2024-001", date: "18.04.2024 06:30", biotope: "Лес",                   lat: 54.980,  lon: 73.410,  rare: false, flock: "Одиночная особь" },
  { id: 52,  species: "Болотная сова",            latin: "Asio flammeus",          count: 2,   status: "confirmed",           session: "SS-2024-001", date: "18.04.2024 07:00", biotope: "Водно-болотные угодья", lat: 55.120,  lon: 72.880,  rare: false, flock: "Пара" },
  { id: 53,  species: "Ушастая сова",             latin: "Asio otus",              count: 1,   status: "confirmed",           session: "SS-2024-001", date: "19.04.2024 08:15", biotope: "Лес",                   lat: 54.820,  lon: 73.150,  rare: false, flock: "Одиночная особь" },
  { id: 54,  species: "Обыкновенная пустельга",   latin: "Falco tinnunculus",      count: 1,   status: "confirmed",           session: "SS-2024-001", date: "20.04.2024 09:00", biotope: "Лес",                   lat: 55.060,  lon: 73.620,  rare: false, flock: "Одиночная особь" },
  { id: 55,  species: "Бекас",                    latin: "Gallinago gallinago",    count: 12,  status: "confirmed",           session: "SS-2024-001", date: "23.04.2024 07:30", biotope: "Водно-болотные угодья", lat: 55.280,  lon: 73.760,  rare: false, flock: "Средняя стая" },
  { id: 56,  species: "Чернозобик",               latin: "Calidris alpina",        count: 34,  status: "confirmed",           session: "SS-2024-001", date: "24.04.2024 09:15", biotope: "Водно-болотные угодья", lat: 55.180,  lon: 73.080,  rare: false, flock: "Крупная стая" },
  { id: 57,  species: "Речная крачка",            latin: "Sterna hirundo",         count: 34,  status: "confirmed",           session: "SS-2024-001", date: "23.04.2024 08:00", biotope: "Водно-болотные угодья", lat: 54.910,  lon: 72.340,  rare: false, flock: "Крупная стая" },
  { id: 58,  species: "Белая трясогузка",         latin: "Motacilla alba",         count: 18,  status: "submitted",           session: "SS-2024-001", date: "26.04.2024 08:30", biotope: "Агроландшафт",          lat: 55.320,  lon: 73.940,  rare: false, flock: "Средняя стая" },
  // Якутия — SS-2024-001
  { id: 61,  species: "Белая куропатка",          latin: "Lagopus lagopus",        count: 3,   status: "confirmed",           session: "SS-2024-001", date: "25.05.2024 05:00", biotope: "Тундра",                lat: 62.450,  lon: 129.720, rare: false, flock: "Пара" },
  { id: 62,  species: "Тетерев",                  latin: "Lyrurus tetrix",         count: 7,   status: "confirmed",           session: "SS-2024-001", date: "25.05.2024 06:00", biotope: "Тундра",                lat: 62.580,  lon: 130.150, rare: false, flock: "Мелкая группа" },
  { id: 63,  species: "Золотистая ржанка",        latin: "Pluvialis apricaria",    count: 22,  status: "confirmed",           session: "SS-2024-001", date: "26.05.2024 05:30", biotope: "Тундра",                lat: 62.310,  lon: 129.440, rare: false, flock: "Средняя стая" },
  { id: 64,  species: "Луговой конёк",           latin: "Anthus pratensis",       count: 11,  status: "confirmed",           session: "SS-2024-001", date: "27.05.2024 06:15", biotope: "Тундра",                lat: 62.720,  lon: 130.480, rare: false, flock: "Средняя стая" },
  // Казахстан — SS-2024-001
  { id: 71,  species: "Дербник",                  latin: "Falco columbarius",      count: 1,   status: "confirmed",           session: "SS-2024-001", date: "15.04.2024 07:00", biotope: "Степь",                 lat: 50.280,  lon: 61.440,  rare: false, flock: "Одиночная особь" },
  { id: 72,  species: "Чернозобик",               latin: "Calidris alpina",        count: 45,  status: "confirmed",           session: "SS-2024-001", date: "16.04.2024 08:00", biotope: "Степь",                 lat: 50.950,  lon: 62.180,  rare: false, flock: "Крупная стая" },
  { id: 73,  species: "Серебристая чайка",        latin: "Larus argentatus",       count: 230, status: "confirmed",           session: "SS-2024-001", date: "20.04.2024 07:15", biotope: "Пустыни",               lat: 50.080,  lon: 61.050,  rare: false, flock: "Массовое скопление" },
  { id: 74,  species: "Обыкновенный канюк",       latin: "Buteo buteo",            count: 2,   status: "confirmed",           session: "SS-2024-001", date: "19.04.2024 08:30", biotope: "Степь",                 lat: 50.410,  lon: 61.920,  rare: false, flock: "Пара" },
  { id: 75,  species: "Чибис",                    latin: "Vanellus vanellus",      count: 14,  status: "confirmed",           session: "SS-2024-001", date: "21.04.2024 08:00", biotope: "Степь",                 lat: 51.350,  lon: 62.780,  rare: false, flock: "Средняя стая" },
  // Беларусь — SS-2024-002
  { id: 81,  species: "Болотный лунь",            latin: "Circus aeruginosus",     count: 3,   status: "confirmed",           session: "SS-2024-002", date: "08.05.2024 07:00", biotope: "Лес",                   lat: 52.100,  lon: 23.680,  rare: false, flock: "Пара" },
  { id: 82,  species: "Чёрный коршун",           latin: "Milvus migrans",         count: 1,   status: "confirmed",           session: "SS-2024-002", date: "08.05.2024 08:00", biotope: "Водно-болотные угодья", lat: 52.240,  lon: 24.120,  rare: false, flock: "Одиночная особь" },
  { id: 83,  species: "Тетеревятник",             latin: "Accipiter gentilis",     count: 1,   status: "confirmed",           session: "SS-2024-002", date: "09.05.2024 06:30", biotope: "Лес",                   lat: 52.060,  lon: 23.940,  rare: false, flock: "Одиночная особь" },
  { id: 84,  species: "Сойка",                    latin: "Garrulus glandarius",    count: 2,   status: "confirmed",           session: "SS-2024-002", date: "10.05.2024 08:00", biotope: "Лес",                   lat: 52.310,  lon: 24.380,  rare: false, flock: "Пара" },
  { id: 85,  species: "Речная крачка",            latin: "Sterna hirundo",         count: 18,  status: "confirmed",           session: "SS-2024-002", date: "11.05.2024 09:15", biotope: "Водно-болотные угодья", lat: 52.180,  lon: 24.660,  rare: false, flock: "Средняя стая" },
  { id: 86,  species: "Чёрный стриж",            latin: "Apus apus",              count: 6,   status: "confirmed",           session: "SS-2024-002", date: "12.05.2024 07:45", biotope: "Урбанизированные",      lat: 52.050,  lon: 23.440,  rare: false, flock: "Мелкая группа" },
  { id: 87,  species: "Белая трясогузка",         latin: "Motacilla alba",         count: 11,  status: "submitted",           session: "SS-2024-002", date: "13.05.2024 08:30", biotope: "Водно-болотные угодья", lat: 52.420,  lon: 24.920,  rare: false, flock: "Средняя стая" },
  // Украина — SS-2024-005
  { id: 91,  species: "Озёрная чайка",           latin: "Larus ridibundus",       count: 34,  status: "confirmed",           session: "SS-2024-005", date: "10.06.2024 06:00", biotope: "Водно-болотные угодья", lat: 46.610,  lon: 32.720,  rare: false, flock: "Крупная стая" },
  { id: 92,  species: "Большой баклан",           latin: "Phalacrocorax carbo",    count: 88,  status: "confirmed",           session: "SS-2024-005", date: "10.06.2024 07:00", biotope: "Водно-болотные угодья", lat: 46.580,  lon: 32.840,  rare: false, flock: "Крупная стая" },
  { id: 93,  species: "Серебристая чайка",        latin: "Larus argentatus",       count: 52,  status: "confirmed",           session: "SS-2024-005", date: "11.06.2024 06:30", biotope: "Водно-болотные угодья", lat: 46.700,  lon: 33.110,  rare: false, flock: "Крупная стая" },
  { id: 94,  species: "Речная крачка",            latin: "Sterna hirundo",         count: 43,  status: "confirmed",           session: "SS-2024-005", date: "12.06.2024 07:15", biotope: "Водно-болотные угодья", lat: 46.640,  lon: 32.960,  rare: false, flock: "Крупная стая" },
  { id: 95,  species: "Чибис",                    latin: "Vanellus vanellus",      count: 27,  status: "confirmed",           session: "SS-2024-005", date: "13.06.2024 08:00", biotope: "Водно-болотные угодья", lat: 46.550,  lon: 32.620,  rare: false, flock: "Средняя стая" },
  // Урал — SS-2024-002
  { id: 101, species: "Глухарь",                  latin: "Tetrao urogallus",       count: 2,   status: "confirmed",           session: "SS-2024-002", date: "22.05.2024 05:30", biotope: "Лес",                   lat: 56.840,  lon: 60.620,  rare: false, flock: "Пара" },
  { id: 102, species: "Чёрный дятел",             latin: "Dryocopus martius",      count: 1,   status: "confirmed",           session: "SS-2024-002", date: "22.05.2024 06:00", biotope: "Лес",                   lat: 57.120,  lon: 61.080,  rare: false, flock: "Одиночная особь" },
  { id: 103, species: "Большой пёстрый дятел",   latin: "Dendrocopos major",      count: 1,   status: "confirmed",           session: "SS-2024-002", date: "23.05.2024 08:00", biotope: "Лес",                   lat: 56.720,  lon: 60.840,  rare: false, flock: "Одиночная особь" },
  { id: 104, species: "Тетеревятник",             latin: "Accipiter gentilis",     count: 2,   status: "confirmed",           session: "SS-2024-002", date: "24.05.2024 09:00", biotope: "Лес",                   lat: 57.290,  lon: 60.410,  rare: false, flock: "Пара" },
  { id: 105, species: "Неясыть серая",            latin: "Strix aluco",            count: 1,   status: "confirmed",           session: "SS-2024-002", date: "25.05.2024 22:30", biotope: "Лес",                   lat: 56.960,  lon: 61.340,  rare: false, flock: "Одиночная особь" },
  { id: 106, species: "Домовый воробей",          latin: "Passer domesticus",      count: 22,  status: "submitted",           session: "SS-2024-002", date: "27.05.2024 07:30", biotope: "Урбанизированные",      lat: 56.840,  lon: 60.654,  rare: false, flock: "Средняя стая" },
  // Дальний Восток — SS-2024-003
  { id: 111, species: "Чёрный стриж",             latin: "Apus apus",              count: 20,  status: "confirmed",           session: "SS-2024-003", date: "15.09.2024 07:00", biotope: "Урбанизированные",      lat: 43.870,  lon: 131.890, rare: false, flock: "Средняя стая" },
  { id: 112, species: "Тетеревятник",             latin: "Accipiter gentilis",     count: 1,   status: "confirmed",           session: "SS-2024-003", date: "16.09.2024 08:30", biotope: "Лес",                   lat: 43.650,  lon: 132.240, rare: false, flock: "Одиночная особь" },
  { id: 113, species: "Большой баклан",           latin: "Phalacrocorax carbo",    count: 76,  status: "confirmed",           session: "SS-2024-003", date: "20.09.2024 08:00", biotope: "Побережье",             lat: 43.720,  lon: 132.100, rare: false, flock: "Крупная стая" },
  { id: 114, species: "Серебристая чайка",        latin: "Larus argentatus",       count: 91,  status: "confirmed",           session: "SS-2024-003", date: "21.09.2024 07:15", biotope: "Побережье",             lat: 43.560,  lon: 131.720, rare: false, flock: "Крупная стая" },
  // Армения — SS-2024-005
  { id: 121, species: "Чибис",                    latin: "Vanellus vanellus",      count: 45,  status: "confirmed",           session: "SS-2024-005", date: "18.06.2024 06:00", biotope: "Водно-болотные угодья", lat: 40.320,  lon: 45.280,  rare: false, flock: "Крупная стая" },
  { id: 122, species: "Озёрная чайка",           latin: "Larus ridibundus",       count: 22,  status: "confirmed",           session: "SS-2024-005", date: "19.06.2024 07:00", biotope: "Водно-болотные угодья", lat: 40.450,  lon: 45.420,  rare: false, flock: "Средняя стая" },
  { id: 123, species: "Большой баклан",           latin: "Phalacrocorax carbo",    count: 67,  status: "confirmed",           session: "SS-2024-005", date: "20.06.2024 08:00", biotope: "Водно-болотные угодья", lat: 40.280,  lon: 45.160,  rare: false, flock: "Крупная стая" },
  { id: 124, species: "Балобан",                  latin: "Falco cherrug",          count: 1,   status: "confirmed",           session: "SS-2024-005", date: "21.06.2024 09:30", biotope: "Горные территории",     lat: 40.510,  lon: 45.620,  rare: true,  flock: "Одиночная особь" },
  { id: 125, species: "Большой кроншнеп",         latin: "Numenius arquata",       count: 3,   status: "confirmed",           session: "SS-2024-005", date: "22.06.2024 07:30", biotope: "Водно-болотные угодья", lat: 40.390,  lon: 45.350,  rare: true,  flock: "Пара" },
  // Узбекистан — SS-2024-001
  { id: 131, species: "Деревенская ласточка",     latin: "Hirundo rustica",        count: 18,  status: "confirmed",           session: "SS-2024-001", date: "10.04.2024 06:30", biotope: "Агроландшафт",          lat: 40.780,  lon: 71.420,  rare: false, flock: "Средняя стая" },
  { id: 132, species: "Зелёный дятел",           latin: "Picus viridis",          count: 5,   status: "confirmed",           session: "SS-2024-001", date: "11.04.2024 07:00", biotope: "Горные территории",     lat: 40.920,  lon: 71.860,  rare: false, flock: "Мелкая группа" },
  { id: 133, species: "Белая трясогузка",         latin: "Motacilla alba",         count: 34,  status: "confirmed",           session: "SS-2024-001", date: "12.04.2024 08:30", biotope: "Агроландшафт",          lat: 40.660,  lon: 71.640,  rare: false, flock: "Крупная стая" },
  { id: 134, species: "Удод",                     latin: "Upupa epops",            count: 2,   status: "confirmed",           session: "SS-2024-001", date: "13.04.2024 09:00", biotope: "Горные территории",     lat: 40.850,  lon: 72.110,  rare: false, flock: "Пара" },
  { id: 135, species: "Жёлтая трясогузка",       latin: "Motacilla flava",        count: 9,   status: "submitted",           session: "SS-2024-001", date: "14.04.2024 07:45", biotope: "Агроландшафт",          lat: 41.050,  lon: 71.280,  rare: false, flock: "Мелкая группа" },
]

const COLUMNS = [
  { key: "species",  label: "Вид" },
  { key: "session",  label: "Сессия" },
  { key: "date",     label: "Дата/время" },
  { key: "count",    label: "Числ." },
  { key: "biotope",  label: "Биотоп" },
  { key: "coords",   label: "Координаты" },
  { key: "status",   label: "Статус" },
]

export default function ObservationsPage() {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [onlyRare, setOnlyRare] = useState(false)

  const filtered = OBSERVATIONS.filter(o => {
    const matchSearch = o.species.toLowerCase().includes(search.toLowerCase()) ||
                        o.latin.toLowerCase().includes(search.toLowerCase()) ||
                        o.session.includes(search)
    const matchStatus = filterStatus === "all" || o.status === filterStatus
    const matchRare   = !onlyRare || o.rare
    return matchSearch && matchStatus && matchRare
  })

  const totalCount = filtered.reduce((s, o) => s + o.count, 0)

  return (
    <OrnithologyLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Наблюдения</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {filtered.length} записей · суммарная численность: <span className="font-semibold text-bird">{totalCount.toLocaleString()}</span>
            </p>
          </div>
          <Link
            to="/observations/new"
            className="flex items-center gap-2 px-4 py-2 bg-bird text-white rounded-lg text-sm font-medium hover:bg-bird-dark transition-colors"
          >
            <Icon name="Plus" size={16} />
            Добавить наблюдение
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Вид, латинское название, сессия..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-bird/30"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none"
          >
            <option value="all">Все статусы</option>
            <option value="draft">Черновик</option>
            <option value="submitted">На проверке</option>
            <option value="needs_clarification">Требует уточнения</option>
            <option value="confirmed">Подтверждено</option>
            <option value="rejected">Отклонено</option>
          </select>
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyRare}
              onChange={e => setOnlyRare(e.target.checked)}
              className="w-4 h-4 rounded border-border accent-bird"
            />
            <Icon name="Star" size={14} className="text-amber-500" />
            Только редкие
          </label>
        </div>

        {/* Table */}
        <div className="bg-muted rounded-2xl ring-1 ring-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  {COLUMNS.map(c => (
                    <th key={c.key} className="text-left py-3 px-4 text-xs text-muted-foreground font-medium whitespace-nowrap">
                      {c.label}
                    </th>
                  ))}
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(obs => (
                  <tr
                    key={obs.id}
                    className={`border-b border-border/50 hover:bg-background transition-colors
                      ${obs.status === "needs_clarification" ? "bg-amber-50/50 dark:bg-amber-900/10" : ""}
                      ${obs.rare ? "border-l-2 border-l-amber-400" : ""}
                    `}
                  >
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {obs.rare && <Icon name="Star" size={12} className="text-amber-500 flex-shrink-0" />}
                        <div>
                          <div className="font-medium whitespace-nowrap">{obs.species}</div>
                          <div className="text-xs text-muted-foreground italic">{obs.latin}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="text-xs font-mono text-muted-foreground">{obs.session}</span>
                    </td>
                    <td className="py-2.5 px-4 text-muted-foreground whitespace-nowrap text-xs">{obs.date}</td>
                    <td className="py-2.5 px-4 font-bold text-bird">{obs.count}</td>
                    <td className="py-2.5 px-4 text-muted-foreground text-xs whitespace-nowrap">{obs.biotope}</td>
                    <td className="py-2.5 px-4 text-xs text-muted-foreground whitespace-nowrap font-mono">
                      {obs.lat.toFixed(4)}, {obs.lon.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${STATUS_BADGE[obs.status].color}`}>
                        {STATUS_BADGE[obs.status].label}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-1">
                        <button className="p-1 text-muted-foreground hover:text-foreground transition-colors" title="Редактировать">
                          <Icon name="Pencil" size={14} />
                        </button>
                        <button className="p-1 text-muted-foreground hover:text-foreground transition-colors" title="Карточка">
                          <Icon name="ExternalLink" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">Наблюдения не найдены</div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Icon name="Star" size={12} className="text-amber-500" />
            <span>Редкий/охраняемый вид</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 border-l-2 border-amber-400 bg-amber-50 dark:bg-amber-900/10" />
            <span>Запись с замечанием эксперта</span>
          </div>
        </div>

      </div>
    </OrnithologyLayout>
  )
}