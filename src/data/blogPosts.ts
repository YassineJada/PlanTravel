export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

export const blogPosts: Record<string, BlogPost[]> = {
  en: [
    {
      id: '1',
      title: '10 Hidden Gems in Europe You Must Visit',
      excerpt: 'Discover the most beautiful lesser-known destinations across Europe that will take your breath away.',
      content: 'Full article content here...',
      category: 'Destinations',
      image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800',
      author: 'Sarah Johnson',
      date: '2024-12-10',
      readTime: '8 min read',
      tags: ['Europe', 'Travel Tips', 'Hidden Gems']
    },
    {
      id: '2',
      title: 'Budget Travel: How to See the World for Less',
      excerpt: 'Learn expert tips and tricks to travel the world without breaking the bank.',
      content: 'Full article content here...',
      category: 'Budget Travel',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
      author: 'Mike Chen',
      date: '2024-12-08',
      readTime: '6 min read',
      tags: ['Budget', 'Tips', 'Money Saving']
    },
    {
      id: '3',
      title: 'Best Food Markets Around the World',
      excerpt: 'A culinary journey through the most vibrant and delicious food markets on the planet.',
      content: 'Full article content here...',
      category: 'Food & Culture',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      author: 'Emma Rodriguez',
      date: '2024-12-05',
      readTime: '10 min read',
      tags: ['Food', 'Culture', 'Markets']
    },
    {
      id: '4',
      title: 'Solo Travel Guide: Safety Tips for Women',
      excerpt: 'Essential advice and safety tips for women traveling alone around the world.',
      content: 'Full article content here...',
      category: 'Solo Travel',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
      author: 'Lisa Anderson',
      date: '2024-12-03',
      readTime: '7 min read',
      tags: ['Solo Travel', 'Safety', 'Women']
    },
    {
      id: '5',
      title: 'Digital Nomad Paradise: Top 15 Cities',
      excerpt: 'The best cities for remote workers with great WiFi, co-working spaces, and lifestyle.',
      content: 'Full article content here...',
      category: 'Digital Nomad',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
      author: 'Alex Turner',
      date: '2024-12-01',
      readTime: '12 min read',
      tags: ['Digital Nomad', 'Remote Work', 'Cities']
    },
    {
      id: '6',
      title: 'Sustainable Travel: How to Reduce Your Footprint',
      excerpt: 'Practical ways to travel more responsibly and minimize your environmental impact.',
      content: 'Full article content here...',
      category: 'Sustainable Travel',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      author: 'Green Traveler',
      date: '2024-11-28',
      readTime: '9 min read',
      tags: ['Sustainable', 'Eco-Friendly', 'Environment']
    },
    {
      id: '7',
      title: 'Adventure Travel: Thrilling Experiences Worldwide',
      excerpt: 'From skydiving to scuba diving, discover the most exhilarating adventures around the globe.',
      content: 'Full article content here...',
      category: 'Adventure',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      author: 'Jack Wild',
      date: '2024-11-25',
      readTime: '11 min read',
      tags: ['Adventure', 'Extreme Sports', 'Adrenaline']
    },
    {
      id: '8',
      title: 'Family Travel: Best Destinations for Kids',
      excerpt: 'Kid-friendly destinations that the whole family will love and remember forever.',
      content: 'Full article content here...',
      category: 'Family Travel',
      image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800',
      author: 'Family Travel Co',
      date: '2024-11-22',
      readTime: '8 min read',
      tags: ['Family', 'Kids', 'Destinations']
    },
    {
      id: '9',
      title: 'Photography Guide: Capturing Your Travel Moments',
      excerpt: 'Professional tips and techniques to take stunning travel photos that tell your story.',
      content: 'Full article content here...',
      category: 'Photography',
      image: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=800',
      author: 'David Camera',
      date: '2024-11-20',
      readTime: '10 min read',
      tags: ['Photography', 'Tips', 'Travel Photography']
    },
    {
      id: '10',
      title: 'Asia on a Budget: 2-Week Itinerary',
      excerpt: 'Explore the wonders of Southeast Asia for under $1000 with this detailed budget itinerary.',
      content: 'Full article content here...',
      category: 'Budget Travel',
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
      author: 'Budget Wanderer',
      date: '2024-11-18',
      readTime: '15 min read',
      tags: ['Asia', 'Budget', 'Itinerary']
    },
    {
      id: '11',
      title: 'Luxury Travel: 5-Star Experiences Worth the Splurge',
      excerpt: 'Indulge in the world\'s most exclusive resorts, hotels, and experiences that redefine luxury.',
      content: 'Full article content here...',
      category: 'Luxury Travel',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      author: 'Luxe Traveler',
      date: '2024-11-15',
      readTime: '12 min read',
      tags: ['Luxury', 'Hotels', '5-Star']
    },
    {
      id: '12',
      title: 'Beach Paradise: Top 20 Tropical Islands',
      excerpt: 'Crystal-clear waters and white sandy beaches await at these stunning tropical destinations.',
      content: 'Full article content here...',
      category: 'Beach Destinations',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      author: 'Beach Lover',
      date: '2024-11-12',
      readTime: '14 min read',
      tags: ['Beach', 'Islands', 'Tropical']
    },
    {
      id: '13',
      title: 'Winter Wonderland: Best Ski Resorts 2024',
      excerpt: 'Hit the slopes at these world-class ski resorts perfect for beginners and experts alike.',
      content: 'Full article content here...',
      category: 'Winter Travel',
      image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800',
      author: 'Snow Rider',
      date: '2024-11-10',
      readTime: '9 min read',
      tags: ['Skiing', 'Winter', 'Mountains']
    },
    {
      id: '14',
      title: 'City Breaks: 48 Hours in Major Cities',
      excerpt: 'Make the most of a weekend getaway with our intensive city break guides.',
      content: 'Full article content here...',
      category: 'City Guides',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
      author: 'Urban Explorer',
      date: '2024-11-08',
      readTime: '11 min read',
      tags: ['City', 'Weekend', 'Quick Trip']
    },
    {
      id: '15',
      title: 'Wildlife Safari: Best National Parks in Africa',
      excerpt: 'Experience the thrill of spotting the Big Five in Africa\'s most spectacular safari destinations.',
      content: 'Full article content here...',
      category: 'Wildlife',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
      author: 'Safari Guide',
      date: '2024-11-05',
      readTime: '13 min read',
      tags: ['Safari', 'Wildlife', 'Africa']
    }
  ],
  fr: [
    {
      id: '1',
      title: '10 Joyaux Cachés en Europe à Visiter',
      excerpt: 'Découvrez les plus belles destinations méconnues d\'Europe qui vous couperont le souffle.',
      content: 'Contenu complet de l\'article ici...',
      category: 'Destinations',
      image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800',
      author: 'Sarah Johnson',
      date: '2024-12-10',
      readTime: '8 min de lecture',
      tags: ['Europe', 'Conseils Voyage', 'Joyaux Cachés']
    },
    {
      id: '2',
      title: 'Voyage Petit Budget: Voir le Monde pour Moins',
      excerpt: 'Apprenez des astuces d\'experts pour voyager dans le monde sans vous ruiner.',
      content: 'Contenu complet de l\'article ici...',
      category: 'Voyage Économique',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
      author: 'Mike Chen',
      date: '2024-12-08',
      readTime: '6 min de lecture',
      tags: ['Budget', 'Conseils', 'Économies']
    },
    {
      id: '3',
      title: 'Meilleurs Marchés Alimentaires du Monde',
      excerpt: 'Un voyage culinaire à travers les marchés les plus vibrants et délicieux de la planète.',
      content: 'Contenu complet de l\'article ici...',
      category: 'Gastronomie',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      author: 'Emma Rodriguez',
      date: '2024-12-05',
      readTime: '10 min de lecture',
      tags: ['Cuisine', 'Culture', 'Marchés']
    },
    {
      id: '4',
      title: 'Guide Voyage Solo: Conseils de Sécurité pour Femmes',
      excerpt: 'Conseils essentiels et astuces de sécurité pour les femmes voyageant seules.',
      content: 'Contenu complet de l\'article ici...',
      category: 'Voyage Solo',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
      author: 'Lisa Anderson',
      date: '2024-12-03',
      readTime: '7 min de lecture',
      tags: ['Voyage Solo', 'Sécurité', 'Femmes']
    },
    {
      id: '5',
      title: 'Paradis Nomade Digital: Top 15 Villes',
      excerpt: 'Les meilleures villes pour travailleurs à distance avec excellent WiFi et espaces de coworking.',
      content: 'Contenu complet de l\'article ici...',
      category: 'Nomade Digital',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
      author: 'Alex Turner',
      date: '2024-12-01',
      readTime: '12 min de lecture',
      tags: ['Nomade Digital', 'Télétravail', 'Villes']
    },
    {
      id: '6',
      title: 'Voyage Durable: Réduire Votre Empreinte',
      excerpt: 'Façons pratiques de voyager de manière plus responsable et minimiser votre impact environnemental.',
      content: 'Contenu complet de l\'article ici...',
      category: 'Voyage Durable',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      author: 'Voyageur Vert',
      date: '2024-11-28',
      readTime: '9 min de lecture',
      tags: ['Durable', 'Écologique', 'Environnement']
    },
    {
      id: '7',
      title: 'Voyage d\'Aventure: Expériences Palpitantes',
      excerpt: 'Du parachutisme à la plongée, découvrez les aventures les plus excitantes du monde.',
      content: 'Contenu complet de l\'article ici...',
      category: 'Aventure',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      author: 'Jack Wild',
      date: '2024-11-25',
      readTime: '11 min de lecture',
      tags: ['Aventure', 'Sports Extrêmes', 'Adrénaline']
    },
    {
      id: '8',
      title: 'Voyage en Famille: Meilleures Destinations pour Enfants',
      excerpt: 'Destinations adaptées aux enfants que toute la famille adorera.',
      content: 'Contenu complet de l\'article ici...',
      category: 'Voyage Famille',
      image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800',
      author: 'Family Travel Co',
      date: '2024-11-22',
      readTime: '8 min de lecture',
      tags: ['Famille', 'Enfants', 'Destinations']
    },
    {
      id: '9',
      title: 'Guide Photo: Capturer Vos Moments de Voyage',
      excerpt: 'Conseils professionnels et techniques pour prendre des photos de voyage époustouflantes.',
      content: 'Contenu complet de l\'article ici...',
      category: 'Photographie',
      image: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=800',
      author: 'David Camera',
      date: '2024-11-20',
      readTime: '10 min de lecture',
      tags: ['Photographie', 'Conseils', 'Photo Voyage']
    },
    {
      id: '10',
      title: 'Asie à Petit Prix: Itinéraire de 2 Semaines',
      excerpt: 'Explorez les merveilles d\'Asie du Sud-Est pour moins de 1000$ avec cet itinéraire détaillé.',
      content: 'Contenu complet de l\'article ici...',
      category: 'Voyage Économique',
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
      author: 'Budget Wanderer',
      date: '2024-11-18',
      readTime: '15 min de lecture',
      tags: ['Asie', 'Budget', 'Itinéraire']
    },
    {
      id: '11',
      title: 'Voyage de Luxe: Expériences 5 Étoiles',
      excerpt: 'Offrez-vous les resorts et hôtels les plus exclusifs du monde qui redéfinissent le luxe.',
      content: 'Contenu complet de l\'article ici...',
      category: 'Voyage Luxe',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      author: 'Luxe Traveler',
      date: '2024-11-15',
      readTime: '12 min de lecture',
      tags: ['Luxe', 'Hôtels', '5-Étoiles']
    },
    {
      id: '12',
      title: 'Paradis des Plages: Top 20 Îles Tropicales',
      excerpt: 'Eaux cristallines et plages de sable blanc vous attendent dans ces destinations tropicales.',
      content: 'Contenu complet de l\'article ici...',
      category: 'Destinations Plages',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      author: 'Beach Lover',
      date: '2024-11-12',
      readTime: '14 min de lecture',
      tags: ['Plage', 'Îles', 'Tropical']
    },
    {
      id: '13',
      title: 'Paradis Hivernal: Meilleures Stations de Ski 2024',
      excerpt: 'Dévalez les pentes dans ces stations de ski de classe mondiale pour tous les niveaux.',
      content: 'Contenu complet de l\'article ici...',
      category: 'Voyage Hiver',
      image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800',
      author: 'Snow Rider',
      date: '2024-11-10',
      readTime: '9 min de lecture',
      tags: ['Ski', 'Hiver', 'Montagnes']
    },
    {
      id: '14',
      title: 'Escapades Urbaines: 48 Heures dans les Grandes Villes',
      excerpt: 'Profitez au maximum d\'un week-end avec nos guides intensifs d\'escapades urbaines.',
      content: 'Contenu complet de l\'article ici...',
      category: 'Guides Ville',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
      author: 'Urban Explorer',
      date: '2024-11-08',
      readTime: '11 min de lecture',
      tags: ['Ville', 'Week-end', 'Court Séjour']
    },
    {
      id: '15',
      title: 'Safari Sauvage: Meilleurs Parcs Nationaux d\'Afrique',
      excerpt: 'Vivez le frisson d\'observer les Big Five dans les destinations safari les plus spectaculaires d\'Afrique.',
      content: 'Contenu complet de l\'article ici...',
      category: 'Faune',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
      author: 'Safari Guide',
      date: '2024-11-05',
      readTime: '13 min de lecture',
      tags: ['Safari', 'Faune', 'Afrique']
    }
  ],
  ar: [
    {
      id: '1',
      title: '10 جواهر مخفية في أوروبا يجب زيارتها',
      excerpt: 'اكتشف أجمل الوجهات الأقل شهرة في أوروبا التي ستأخذ أنفاسك.',
      content: 'محتوى المقال الكامل هنا...',
      category: 'وجهات سياحية',
      image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800',
      author: 'سارة جونسون',
      date: '2024-12-10',
      readTime: '8 دقائق قراءة',
      tags: ['أوروبا', 'نصائح السفر', 'جواهر مخفية']
    },
    {
      id: '2',
      title: 'السفر بميزانية محدودة: كيف ترى العالم بأقل تكلفة',
      excerpt: 'تعلم نصائح وحيل الخبراء للسفر حول العالم دون إنفاق الكثير.',
      content: 'محتوى المقال الكامل هنا...',
      category: 'سفر اقتصادي',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
      author: 'مايك تشن',
      date: '2024-12-08',
      readTime: '6 دقائق قراءة',
      tags: ['ميزانية', 'نصائح', 'توفير المال']
    },
    {
      id: '3',
      title: 'أفضل أسواق الطعام حول العالم',
      excerpt: 'رحلة طهي عبر أكثر أسواق الطعام حيوية ولذة على هذا الكوكب.',
      content: 'محتوى المقال الكامل هنا...',
      category: 'طعام وثقافة',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      author: 'إيما رودريغيز',
      date: '2024-12-05',
      readTime: '10 دقائق قراءة',
      tags: ['طعام', 'ثقافة', 'أسواق']
    },
    {
      id: '4',
      title: 'دليل السفر الفردي: نصائح الأمان للنساء',
      excerpt: 'نصائح أساسية وإرشادات السلامة للنساء المسافرات بمفردهن حول العالم.',
      content: 'محتوى المقال الكامل هنا...',
      category: 'سفر فردي',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
      author: 'ليزا أندرسون',
      date: '2024-12-03',
      readTime: '7 دقائق قراءة',
      tags: ['سفر فردي', 'أمان', 'نساء']
    },
    {
      id: '5',
      title: 'جنة الرحالة الرقميين: أفضل 15 مدينة',
      excerpt: 'أفضل المدن للعاملين عن بُعد مع إنترنت ممتاز ومساحات عمل مشتركة.',
      content: 'محتوى المقال الكامل هنا...',
      category: 'رحالة رقميون',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
      author: 'أليكس تيرنر',
      date: '2024-12-01',
      readTime: '12 دقيقة قراءة',
      tags: ['رحالة رقميون', 'عمل عن بعد', 'مدن']
    },
    {
      id: '6',
      title: 'السفر المستدام: كيف تقلل بصمتك البيئية',
      excerpt: 'طرق عملية للسفر بمسؤولية أكبر وتقليل تأثيرك البيئي.',
      content: 'محتوى المقال الكامل هنا...',
      category: 'سفر مستدام',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      author: 'المسافر الأخضر',
      date: '2024-11-28',
      readTime: '9 دقائق قراءة',
      tags: ['مستدام', 'صديق للبيئة', 'بيئة']
    },
    {
      id: '7',
      title: 'سفر المغامرات: تجارب مثيرة حول العالم',
      excerpt: 'من القفز بالمظلات إلى الغوص، اكتشف أكثر المغامرات إثارة حول العالم.',
      content: 'محتوى المقال الكامل هنا...',
      category: 'مغامرة',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      author: 'جاك وايلد',
      date: '2024-11-25',
      readTime: '11 دقيقة قراءة',
      tags: ['مغامرة', 'رياضات متطرفة', 'أدرينالين']
    },
    {
      id: '8',
      title: 'سفر العائلة: أفضل الوجهات للأطفال',
      excerpt: 'وجهات مناسبة للأطفال ستحبها العائلة بأكملها وتتذكرها للأبد.',
      content: 'محتوى المقال الكامل هنا...',
      category: 'سفر عائلي',
      image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800',
      author: 'فاميلي ترافل كو',
      date: '2024-11-22',
      readTime: '8 دقائق قراءة',
      tags: ['عائلة', 'أطفال', 'وجهات']
    },
    {
      id: '9',
      title: 'دليل التصوير: التقاط لحظات سفرك',
      excerpt: 'نصائح وتقنيات احترافية لالتقاط صور سفر مذهلة تحكي قصتك.',
      content: 'محتوى المقال الكامل هنا...',
      category: 'تصوير فوتوغرافي',
      image: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=800',
      author: 'ديفيد كاميرا',
      date: '2024-11-20',
      readTime: '10 دقائق قراءة',
      tags: ['تصوير', 'نصائح', 'تصوير السفر']
    },
    {
      id: '10',
      title: 'آسيا بميزانية محدودة: خط سير لمدة أسبوعين',
      excerpt: 'استكشف عجائب جنوب شرق آسيا بأقل من 1000 دولار مع هذا المسار المفصل.',
      content: 'محتوى المقال الكامل هنا...',
      category: 'سفر اقتصادي',
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
      author: 'المسافر الاقتصادي',
      date: '2024-11-18',
      readTime: '15 دقيقة قراءة',
      tags: ['آسيا', 'ميزانية', 'خط سير']
    },
    {
      id: '11',
      title: 'السفر الفاخر: تجارب 5 نجوم تستحق الإنفاق',
      excerpt: 'انغمس في أكثر المنتجعات والفنادق الحصرية في العالم التي تعيد تعريف الفخامة.',
      content: 'محتوى المقال الكامل هنا...',
      category: 'سفر فاخر',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      author: 'المسافر الفاخر',
      date: '2024-11-15',
      readTime: '12 دقيقة قراءة',
      tags: ['فخامة', 'فنادق', '5-نجوم']
    },
    {
      id: '12',
      title: 'جنة الشواطئ: أفضل 20 جزيرة استوائية',
      excerpt: 'مياه صافية ورمال بيضاء تنتظرك في هذه الوجهات الاستوائية المذهلة.',
      content: 'محتوى المقال الكامل هنا...',
      category: 'وجهات شاطئية',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      author: 'عاشق الشاطئ',
      date: '2024-11-12',
      readTime: '14 دقيقة قراءة',
      tags: ['شاطئ', 'جزر', 'استوائي']
    },
    {
      id: '13',
      title: 'عجائب الشتاء: أفضل منتجعات التزلج 2024',
      excerpt: 'انطلق على المنحدرات في منتجعات التزلج العالمية المثالية للمبتدئين والخبراء.',
      content: 'محتوى المقال الكامل هنا...',
      category: 'سفر شتوي',
      image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800',
      author: 'راكب الثلج',
      date: '2024-11-10',
      readTime: '9 دقائق قراءة',
      tags: ['تزلج', 'شتاء', 'جبال']
    },
    {
      id: '14',
      title: 'رحلات المدينة: 48 ساعة في المدن الكبرى',
      excerpt: 'استفد إلى أقصى حد من عطلة نهاية الأسبوع مع أدلة رحلات المدينة المكثفة.',
      content: 'محتوى المقال الكامل هنا...',
      category: 'أدلة المدن',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
      author: 'المستكشف الحضري',
      date: '2024-11-08',
      readTime: '11 دقيقة قراءة',
      tags: ['مدينة', 'عطلة نهاية الأسبوع', 'رحلة سريعة']
    },
    {
      id: '15',
      title: 'رحلة سفاري: أفضل الحدائق الوطنية في أفريقيا',
      excerpt: 'اختبر إثارة رؤية الخمسة الكبار في وجهات السفاري الأكثر إثارة في أفريقيا.',
      content: 'محتوى المقال الكامل هنا...',
      category: 'حياة برية',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
      author: 'دليل السفاري',
      date: '2024-11-05',
      readTime: '13 دقيقة قراءة',
      tags: ['سفاري', 'حياة برية', 'أفريقيا']
    }
  ]
};
