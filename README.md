# Q360 Performans İdarəetmə Platforması

Bu layihə, 360 dərəcə performans idarəetməsi üçün professional səviyyədə bir platforma olan Q360-un inkişafını hədəfləyir. Aşağıdakı sənədlər, layihənin planlaşdırılması və strukturu haqqında ətraflı məlumat verir.

## Layihə Strukturu

### Backend (Django)
```
q360_backend/
├── accounts/                 # İstifadəçi idarəetməsi, autentifikasiya
├── departments/              # Şöbə idarəetməsi
├── evaluations/              # 360 dərəcə qiymətləndirmələr
├── ideas/                    # İdeya bankı funksionallığı
├── notifications/            # Bildiriş sistemi
├── reports/                  # Hesabat mühərriki
├── q360/                     # Əsas layihə qovluğu
├── manage.py                 # Django idarəetmə skripti
├── requirements.txt          # Python asılılıqları
└── .env                      # Mühit dəyişənləri
```

### Frontend (React)
```
q360_frontend/
├── public/                   # Statik resurslar
├── src/
│   ├── assets/               # Şəkillər, ikonlar və digər resurslar
│   ├── components/           # Təkrar istifadə olunan UI komponentləri
│   ├── pages/                # Səhifə komponentləri
│   ├── services/             # API servisləri
│   ├── store/                # Redux mağazası
│   ├── utils/                # Köməkçi funksiyalar
│   ├── hooks/                # Xüsusi qarmaqlar
│   ├── routes/               # Marşrutlaşdırma konfiqurasiyası
│   ├── themes/               # Mövzu konfiqurasiyaları (açıq/qaranlıq)
│   ├── App.js                # Əsas App komponenti
│   └── index.js              # Giriş nöqtəsi
├── package.json              # Node.js asılılıqları
└── .env                      # Mühit dəyişənləri
```

## Planlaşdırma Sənədləri

1. **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Layihə strukturu haqqında ətraflı məlumat
2. **[DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md)** - Ətraflı inkişaf planı
3. **[GAP_ANALYSIS.md](GAP_ANALYSIS.md)** - Hazırkı tətbiqat ilə dizayn tələbləri arasında olan fərqlər
4. **[FEATURE_PRIORITIZATION.md](FEATURE_PRIORITIZATION.md)** - Xüsusiyyətlərin prioritetləşdirilməsi
5. **[IMPLEMENTATION_TIMELINE.md](IMPLEMENTATION_TIMELINE.md)** - Xüsusiyyətlərin həyata keçirilməsi üçün vaxt cədvəli
6. **[TECHNICAL_SPECIFICATIONS.md](TECHNICAL_SPECIFICATIONS.md)** - Hər bir xüsusiyyət üçün texniki spesifikasiyalar
7. **[PLANNING_SUMMARY.md](PLANNING_SUMMARY.md)** - Bütün planlaşdırma işlərinin yekunlaşdırılması

## Əsas Xüsusiyyətlər

- **Əsas Giriş Səhifəsi** - Təhlükəsiz autentifikasiya və rahat giriş
- **İstifadəçi Paneli** - Məlumatların mərkəzləşdirilmiş göstərilməsi
- **360 Dərəcə Qiymətləndirmə Forması** - Rəhbər və ağıllı forma
- **Fərdi Performans Hesabatı** - Analitik dərinlik
- **İdeya Bankı Paneli** - Yaradıcılığın mərkəzi
- **Bildirişlər Mərkəzi** - Fəaliyyətə yönəldici sistem
- **İdarəetmə Panelləri** - Rəhbər və Super Admin panelləri
- **Fərdi Tənzimləmələr** - İstifadəçi profili və tənzimləmələr
- **İnkişaf və Təlim Modulları** - Proaktiv inkişaf platforması
- **Əməkdaşlıq və Ani Rəy Funksiyaları** - Davamlı rəy mədəniyyəti
- **Analitika və Süni İntellekt** - Proqnozlaşdırıcı analitika
- **Mobil Təcrübə** - "Mobile-first" dizayn və PWA dəstəyi

## Texniki Arxitektura

### Frontend
- React.js (TypeScript)
- Redux Toolkit (state idarəetməsi)
- Tailwind CSS (stilizasiya)
- Chart.js/D3.js (datanın vizuallaşdırılması)
- React Router (navigasiya)

### Backend
- Django (Django REST Framework)
- PostgreSQL (verilənlər bazası)
- Redis (keş və arxa fon işləri)
- Celery (asinxron işləmə)
- JWT (autentifikasiya)

## İnkişaf Etapları

1. **Əsas İnfrastuktur** - Autentifikasiya, istifadəçi idarəetməsi, API fundamenti
2. **Əsas Funksionallıq** - Qiymətləndirmə sistemi, panel, hesabatlar
3. **Genişləndirmələr** - İdeya bankı, qeyri-adi bildirişlər
4. **Qabaqcıl Xüsusiyyətlər** - Süni intellekt, inkişaf modulları, admin funksiyaları

## Quraşdırma

### Backend quraşdırması
```bash
cd q360_backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend quraşdırması
```bash
cd q360_frontend
npm install
npm start
```

## Lisenziya

Bu layihə məxfidir və yalnız layihə komandası üzvləri tərəfindən istifadə edilə bilər.