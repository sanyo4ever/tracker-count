import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useLocale } from './i18n';

type AboutPageProps = {
  counts: { ios: number; android: number };
  dates: string[];
  ukrainianAuditUrl: string;
  suggestUrl: string;
};

export default function AboutPage({ counts, dates, ukrainianAuditUrl, suggestUrl }: AboutPageProps) {
  const { t } = useLocale();

  return <main className="about page-width">
    <a href="#/" className="back-link mono"><ArrowDownLeft size={16}/>{t(' BACK TO THE MONUMENT', ' НАЗАД ДО МОНУМЕНТА')}</a>
    <span className="eyebrow">{t('THE SMALL PRINT, AT A REASONABLE SIZE', 'ДРІБНИЙ ШРИФТ, АЛЕ НОРМАЛЬНОГО РОЗМІРУ')}</span>
    <h1>{t('THE JOKE IS FAKE.', 'ЖАРТ ВИГАДАНИЙ.')}<br/>{t('THE APPS ARE REAL', 'ЗАСТОСУНКИ СПРАВЖНІ')}<span className="lime-text">.</span></h1>
    <div className="about-grid">
      <h2>{t('A museum of', 'Музей знову')}<br/>{t('reinvented wheels.', 'винайдених велосипедів.')}</h2>
      <div>
        <p>{t(
          'Every week, the internet announces another way to track the price of a coffee. We thought someone should track the trackers. This is that monument to human persistence.',
          'Щотижня в інтернеті з’являється ще один спосіб записати, скільки коштувала кава. Ми вирішили, що хтось має рахувати самі трекери. Цей сайт — пам’ятник людській наполегливості.',
        )}</p>
        <h3>{t('What are we counting?', 'Що ми рахуємо?')}</h3>
        <p>{t(
          `Exactly ${counts.ios} iOS listings and ${counts.android} Android listings in our curated collection. These are indexed apps, not an estimate of every expense tracker in either store. An app on both platforms counts once in each collection.`,
          `У нашій добірці ${counts.ios} записів для iOS і ${counts.android} для Android. Це застосунки, які ми внесли до каталогу, а не оцінка загальної кількості трекерів витрат у магазинах. Застосунок на обох платформах рахується один раз у кожній колекції.`,
        )}</p>
        <h3>{t('How are the listings verified?', 'Як ми перевіряємо записи?')}</h3>
        <p>{t(
          'The iOS collection uses Apple’s public iTunes API and official App Store listings. Android entries are checked against official Google Play listing pages. Each record includes its source URL and verification date. Listing verification dates: ',
          'Для колекції iOS ми використовуємо публічний iTunes API від Apple та офіційні сторінки App Store. Записи Android перевіряємо за офіційними сторінками Google Play. Кожен запис містить посилання на джерело й дату перевірки. Дати перевірок: ',
        )}<strong>{dates[0]}–{dates.at(-1)}</strong>{t('. Each record keeps its own verification date.', '. Кожен запис зберігає власну дату перевірки.')}</p>
        <p>{t(
          'Tags and short descriptions are editorial summaries. We include personal expense trackers, budget planners, shared-expense tools, and business receipt or expense tools. Store availability and features can change, and may vary by region.',
          'Теги й короткі описи — наші редакційні підсумки. Ми додаємо трекери особистих витрат, планувальники бюджету, інструменти для спільних витрат, а також обліку бізнесових витрат і чеків. Доступність у магазинах та функції можуть змінюватися й залежати від регіону.',
        )}</p>
        <h3>{t('What does Ukrainian-made mean?', 'Що означає «Зроблено в Україні»?')}</h3>
        <p>{t(
          "The filter includes apps with sourced evidence of a Ukrainian developer or team connection. Ukrainian localization or a developer's name alone is not enough. Official Ukrainian titles and documented former names are searchable aliases. ",
          'Фільтр охоплює застосунки, зв’язок розробника або команди яких з Україною підтверджений джерелами. Самої української локалізації чи імені розробника недостатньо. У пошуку також працюють офіційні українські назви й підтверджені попередні назви. ',
        )}<a href={ukrainianAuditUrl} target="_blank" rel="noopener noreferrer">{t('Read the coverage audit and unresolved cases', 'Переглянути перевірку охоплення та нез’ясовані випадки')}</a>{t('. This is not a complete registry of Ukrainian apps.', '. Це не повний реєстр українських застосунків.')}</p>
        <h3>{t('Can developers buy a spot?', 'Розробники можуть купити місце?')}</h3>
        <p>{t(
          'Apparently, yes. Lichy has a ₴100 donation deal for the homepage advertisement. Bigger donations get higher ad placement. That is the entire business model. Sponsored spots are labeled; the collection still follows your chosen sort order.',
          'Виявляється, так. Із Lichy домовилися про донат ₴100 за рекламу на головній. Більший донат — вище рекламне місце. Ось і вся бізнес-модель. Рекламу позначено, а порядок у каталозі й далі залежить від вибраного вами сортування.',
        )}</p>
        <h3>{t('Is that activity feed real?', 'А ця стрічка активності справжня?')}</h3>
        <p>{t(
          'Absolutely not. It’s a rotating set of jokes, labeled as a simulation. We do not track developers, new app releases, or anyone’s finances.',
          'Аж ніяк. Це жарти, які змінюють один одного й позначені як симуляція. Ми не стежимо за розробниками, виходом нових застосунків чи чиїмись фінансами.',
        )}</p>
        <h3>{t('Spotted a missing wheel?', 'Помітили відсутній велосипед?')}</h3>
        <p>{t(
          'Store searches return a limited selection that varies with query and storefront. We combine multiple searches and check relevant listings, but cannot measure total coverage or guarantee that a specific app is included. ',
          'Пошук у магазинах повертає обмежену добірку, яка залежить від запиту й регіону магазину. Ми поєднуємо кілька пошуків і перевіряємо відповідні застосунки, але не можемо виміряти повноту охоплення чи гарантувати наявність конкретного застосунку. ',
        )}<a href={suggestUrl} target="_blank" rel="noopener noreferrer">{t('Suggest a missing app on GitHub', 'Запропонуйте відсутній застосунок на GitHub')}</a>{t(
          ' with its official store URL so it can be reviewed. This museum is not affiliated with Apple or Google. Any paid developer placements are disclosed as advertisements. App names and icons belong to their respective owners.',
          ' з посиланням на офіційну сторінку в магазині, щоб ми могли його перевірити. Цей музей не пов’язаний з Apple або Google. Усі платні розміщення від розробників позначені як реклама. Назви та іконки застосунків належать їхнім власникам.',
        )}</p>
        <a className="pill-button" href="#/ios">{t('Enter the collection', 'До колекції')} <ArrowUpRight size={19}/></a>
      </div>
    </div>
  </main>;
}
