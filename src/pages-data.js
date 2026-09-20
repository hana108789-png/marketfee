/* Site pages required of any ad-supported site: what this is, what it collects, how to reach us. */
(function (root) {
  var SF = root.SF;

  // One entry per page; `body` is an array of [heading, ...paragraphs] blocks.
  SF.PAGES = {
    about: {
      slug: { en: 'about', de: 'ueber-uns', fr: 'a-propos', it: 'chi-siamo', es: 'acerca-de', nl: 'over-ons', ja: 'about', ko: 'about' },
      s: {
        en: {
          title: 'About MarketFee – who builds these fee calculators',
          desc: 'MarketFee is an independent, free set of marketplace seller fee calculators covering marketplaces the big tools ignore, in eight languages.',
          h1: 'About MarketFee',
          body: [
            ['Why this exists',
              'Almost every marketplace fee calculator on the web covers the same three marketplaces: Amazon, eBay and Etsy. If you sell on Coupang, Naver SmartStore, Rakuten Ichiba, Yahoo! Shopping, Kaufland, OTTO, Cdiscount, Fnac or bol, you are left reading a PDF of commission rates and doing the arithmetic yourself — usually in the wrong language.',
              'MarketFee exists to close that gap. Every marketplace here is one the mainstream tools skip, and every calculator is written in the language its sellers actually use.'],
            ['How the numbers are produced',
              'Each marketplace has its own fee model, and the differences matter more than the headline percentage. Coupang separates its payment fee from the sales commission and adds VAT to both. Naver charges a low sales commission but layers an order management fee on top, tiered by your reported annual revenue. Rakuten combines a monthly plan fee with a system usage fee that falls as your sales grow. OTTO charges an extra 16 % on the shipping your customer pays.',
              'Every calculator models these rules individually rather than applying one generic formula. Rates are taken from official fee schedules and established seller guides, and every page lists its sources so you can check them.'],
            ['What we do not do',
              'We do not sell software, take affiliate commissions from the marketplaces, or rank them by who pays us. Where a comparison shows one marketplace paying out more than another, that is the arithmetic, not an endorsement.',
              'We also do not ask you to sign up. There are no accounts, no email capture, and nothing you type is sent to a server — the calculation happens in your browser.'],
            ['Accuracy and corrections',
              'Marketplaces change their fees often, sometimes with little notice. The rates here are a starting point, not gospel, and every one of them is editable so you can put in the figure your own seller account shows.',
              'If you find a rate that is wrong or out of date, tell us and include where you saw the correct figure. Corrections are the most useful message we get.']
          ]
        },
        ko: {
          title: 'MarketFee 소개 – 마켓플레이스 수수료 계산기를 만드는 사람들',
          desc: '대형 도구들이 다루지 않는 마켓플레이스의 수수료 계산기를 8개 언어로 제공하는 독립 무료 서비스입니다.',
          h1: 'MarketFee 소개',
          body: [
            ['왜 만들었나',
              '웹에 있는 마켓플레이스 수수료 계산기는 거의 전부 아마존·이베이·엣시 세 곳만 다룹니다. 쿠팡, 네이버 스마트스토어, 라쿠텐, Yahoo!ショッピング, Kaufland, OTTO, Cdiscount, Fnac, bol에서 파는 셀러는 수수료율 PDF를 열어놓고 직접 계산해야 하고, 그마저 모르는 언어로 된 경우가 많습니다.',
              'MarketFee는 그 빈자리를 메우려고 만들었습니다. 여기 있는 마켓은 전부 주류 도구가 건너뛴 곳이고, 계산기는 그 마켓 셀러가 실제로 쓰는 언어로 쓰여 있습니다.'],
            ['숫자를 어떻게 만드나',
              '마켓마다 수수료 구조가 다르고, 그 차이가 명목 요율보다 중요합니다. 쿠팡은 결제수수료를 판매수수료와 분리해 표기하고 둘 다에 부가세가 붙습니다. 네이버는 판매수수료가 낮은 대신 국세청 신고 매출에 따라 주문관리수수료가 얹힙니다. 라쿠텐은 월 출점료와, 매출이 늘수록 내려가는 시스템이용료가 겹칩니다. OTTO는 고객이 낸 배송비에 16%를 따로 물립니다.',
              '각 계산기는 이 규칙을 하나씩 따로 구현했습니다. 하나의 공식을 모든 마켓에 갖다 쓰지 않았습니다. 요율은 공식 수수료표와 신뢰할 만한 셀러 가이드에서 가져왔고, 모든 페이지 하단에 출처를 적어 두었습니다.'],
            ['하지 않는 것',
              '소프트웨어를 팔지 않고, 마켓에서 제휴 수수료를 받지 않으며, 돈을 낸 순서로 순위를 매기지 않습니다. 비교표에서 어떤 마켓이 더 많이 남는다고 나오면 그건 계산 결과일 뿐 추천이 아닙니다.',
              '가입을 요구하지도 않습니다. 계정도 이메일 수집도 없고, 입력한 내용은 서버로 전송되지 않습니다. 계산은 전부 브라우저 안에서 일어납니다.'],
            ['정확성과 정정',
              '마켓은 수수료를 자주 바꾸고, 예고가 짧을 때도 많습니다. 여기 요율은 출발점이지 정답이 아니며, 모두 직접 수정할 수 있게 해두었습니다. 본인 판매자 센터에 나오는 숫자를 넣어서 쓰시면 됩니다.',
              '틀렸거나 오래된 요율을 발견하시면 알려주세요. 맞는 숫자를 어디서 보셨는지 함께 적어주시면 가장 도움이 됩니다.']
          ]
        },
        ja: {
          title: 'MarketFeeについて – モール手数料計算ツールを作っている人たち',
          desc: '大手ツールが扱わないモールの手数料計算ツールを8言語で提供する、独立・無料のサービスです。',
          h1: 'MarketFeeについて',
          body: [
            ['なぜ作ったか',
              'ウェブ上のモール手数料計算ツールは、そのほとんどがAmazon・eBay・Etsyの3つしか扱っていません。楽天市場、Yahoo!ショッピング、Qoo10、クーパン、Kaufland、OTTO、Cdiscount、Fnac、bolで販売する出店者は、料率表のPDFを開いて自分で計算するしかなく、しかも読めない言語であることも少なくありません。',
              'MarketFeeはその空白を埋めるために作りました。ここにあるモールはすべて主要ツールが飛ばしている先で、計算ツールはその出店者が実際に使う言語で書かれています。'],
            ['数字の作り方',
              'モールごとに手数料の仕組みが違い、その違いは表向きの料率よりも効いてきます。楽天市場は月額出店料と、売上が伸びるほど下がるシステム利用料が重なります。Yahoo!ショッピングは2026年9月から月額システム利用料と売上ロイヤリティが新設されました。Qoo10は月額0円でカテゴリ別料率のみ。クーパンは決済手数料を販売手数料と分けて表示し、両方に付加価値税がかかります。',
              '各計算ツールはこれらの規則を個別に実装しています。ひとつの式をすべてのモールに当てはめてはいません。料率は公式の手数料表と信頼できる出店ガイドから取り、各ページの下部に出典を明記しています。'],
            ['やらないこと',
              'ソフトウェアを販売せず、モールからアフィリエイト報酬を受け取らず、支払い順に並べることもしません。比較表であるモールの利益が多く出ても、それは計算結果であって推奨ではありません。',
              '登録も求めません。アカウントもメール収集もなく、入力した内容はサーバーに送信されません。計算はすべてブラウザ内で行われます。'],
            ['正確性と訂正',
              'モールは手数料を頻繁に変更し、予告が短いこともあります。ここの料率は出発点であって決定版ではありません。すべて編集できるようにしてあるので、ご自身の管理画面に出ている数字を入れてお使いください。',
              '誤りや古い料率を見つけたらお知らせください。正しい数字をどこで見たかを添えていただけると最も助かります。']
          ]
        },
        de: {
          title: 'Über MarketFee – wer diese Marktplatz-Gebührenrechner baut',
          desc: 'MarketFee ist eine unabhängige, kostenlose Sammlung von Gebührenrechnern für Marktplätze, die große Tools auslassen – in acht Sprachen.',
          h1: 'Über MarketFee',
          body: [
            ['Warum es das gibt',
              'Fast jeder Gebührenrechner im Netz deckt dieselben drei Marktplätze ab: Amazon, eBay und Etsy. Wer auf Kaufland, OTTO, Cdiscount, Fnac, bol, Rakuten, Yahoo! Shopping oder Coupang verkauft, sitzt vor einer PDF-Gebührentabelle und rechnet selbst – oft in einer Sprache, die er nicht beherrscht.',
              'MarketFee schließt diese Lücke. Jeder Marktplatz hier ist einer, den die gängigen Tools überspringen, und jeder Rechner ist in der Sprache seiner Händler geschrieben.'],
            ['Wie die Zahlen entstehen',
              'Jeder Marktplatz hat sein eigenes Gebührenmodell, und die Unterschiede wiegen schwerer als der Prozentsatz auf dem Papier. Kaufland berechnet die Provision auf den Bruttopreis inklusive Versand. OTTO nimmt zusätzlich 16 % auf die vom Kunden gezahlten Versandkosten. Cdiscount rechnet auf den Preis inklusive Mehrwertsteuer plus Porto. TikTok Shop weist seine Sätze inklusive Steuern aus.',
              'Jeder Rechner bildet diese Regeln einzeln ab statt eine Einheitsformel anzuwenden. Die Sätze stammen aus offiziellen Gebührentabellen und etablierten Händler-Guides; jede Seite nennt ihre Quellen.'],
            ['Was wir nicht tun',
              'Wir verkaufen keine Software, nehmen keine Affiliate-Provisionen der Marktplätze und sortieren niemanden nach Bezahlung. Wenn ein Vergleich zeigt, dass ein Marktplatz mehr auszahlt, ist das Rechnerei, keine Empfehlung.',
              'Eine Anmeldung ist nicht nötig. Es gibt keine Konten, keine E-Mail-Erfassung, und nichts von dem, was Sie eingeben, verlässt Ihren Browser.'],
            ['Genauigkeit und Korrekturen',
              'Marktplätze ändern ihre Gebühren häufig, manchmal kurzfristig. Die Sätze hier sind ein Ausgangspunkt, kein Evangelium, und alle sind editierbar – tragen Sie ruhig die Zahl aus Ihrem eigenen Händlerkonto ein.',
              'Wenn Sie einen falschen oder veralteten Satz finden, schreiben Sie uns und nennen Sie die Quelle des richtigen Werts. Korrekturen sind die nützlichsten Nachrichten, die wir bekommen.']
          ]
        },
        fr: {
          title: 'À propos de MarketFee – qui construit ces calculateurs',
          desc: 'MarketFee est un ensemble indépendant et gratuit de calculateurs de frais vendeur pour les marketplaces que les grands outils ignorent.',
          h1: 'À propos de MarketFee',
          body: [
            ['Pourquoi ce site existe',
              'Presque tous les calculateurs de frais du web couvrent les trois mêmes marketplaces : Amazon, eBay et Etsy. Si vous vendez sur Cdiscount, Fnac, Kaufland, OTTO, bol, Rakuten, Yahoo! Shopping ou Coupang, il vous reste un PDF de taux de commission et votre calculette – souvent dans une langue que vous ne lisez pas.',
              'MarketFee comble ce manque. Chaque marketplace ici est une que les outils grand public sautent, et chaque calculateur est écrit dans la langue de ses vendeurs.'],
            ['Comment les chiffres sont produits',
              'Chaque marketplace a son propre modèle de frais, et les différences pèsent plus que le pourcentage affiché. Cdiscount calcule sur le prix TTC plus les frais de port. Fnac fait varier le taux selon la catégorie et l’état du produit. OTTO ajoute 16 % sur les frais de port payés par le client. TikTok Shop annonce ses taux taxes comprises.',
              'Chaque calculateur modélise ces règles séparément plutôt que d’appliquer une formule unique. Les taux proviennent des grilles officielles et de guides vendeurs établis ; chaque page cite ses sources.'],
            ['Ce que nous ne faisons pas',
              'Nous ne vendons pas de logiciel, ne touchons pas de commissions d’affiliation des marketplaces et ne classons personne selon ce qu’il paierait. Si une comparaison montre qu’une marketplace reverse davantage, c’est de l’arithmétique, pas une recommandation.',
              'Aucune inscription n’est demandée. Pas de compte, pas de collecte d’e-mail, et rien de ce que vous saisissez ne quitte votre navigateur.'],
            ['Exactitude et corrections',
              'Les marketplaces modifient souvent leurs frais, parfois avec peu de préavis. Les taux ici sont un point de départ, pas une vérité figée, et tous sont modifiables : mettez le chiffre affiché dans votre propre espace vendeur.',
              'Si vous trouvez un taux faux ou périmé, dites-le nous en indiquant où vous avez vu le bon. Les corrections sont les messages les plus utiles que nous recevons.']
          ]
        },
        nl: {
          title: 'Over MarketFee – wie deze commissiecalculators bouwt',
          desc: 'MarketFee is een onafhankelijke, gratis verzameling commissiecalculators voor marketplaces die de grote tools overslaan.',
          h1: 'Over MarketFee',
          body: [
            ['Waarom dit bestaat',
              'Vrijwel elke commissiecalculator op het web dekt dezelfde drie marketplaces: Amazon, eBay en Etsy. Verkoop je op bol, Kaufland, OTTO, Cdiscount, Fnac, Rakuten, Yahoo! Shopping of Coupang, dan blijf je zitten met een pdf vol tarieven en je eigen rekenwerk – vaak in een taal die je niet leest.',
              'MarketFee vult dat gat. Elke marketplace hier is er een die de bekende tools overslaan, en elke calculator staat in de taal die de verkopers er echt gebruiken.'],
            ['Hoe de cijfers tot stand komen',
              'Elke marketplace heeft zijn eigen kostenmodel, en die verschillen wegen zwaarder dan het percentage op papier. bol combineert een vast bedrag per artikel met een percentage per categorie, beide exclusief btw. Kaufland rekent over de brutoprijs inclusief verzending. OTTO pakt daarbovenop 16 % van de verzendkosten die de klant betaalt.',
              'Elke calculator bouwt die regels apart na in plaats van één formule op alles los te laten. Tarieven komen uit officiële tarievenlijsten en gevestigde verkopersgidsen; elke pagina noemt zijn bronnen.'],
            ['Wat we niet doen',
              'We verkopen geen software, krijgen geen affiliate-vergoeding van de marketplaces en rangschikken niemand op basis van betaling. Laat een vergelijking zien dat de ene marketplace meer uitbetaalt, dan is dat rekenwerk, geen aanbeveling.',
              'Aanmelden hoeft niet. Geen accounts, geen e-mailadressen verzamelen, en niets van wat je invult verlaat je browser.'],
            ['Nauwkeurigheid en correcties',
              'Marketplaces wijzigen hun tarieven regelmatig, soms met korte aankondiging. De tarieven hier zijn een startpunt, geen wet, en allemaal aanpasbaar – vul gerust het bedrag in dat je eigen verkoopaccount toont.',
              'Vind je een tarief dat fout of verouderd is, laat het weten en vermeld waar je het juiste zag. Correcties zijn de nuttigste berichten die we krijgen.']
          ]
        },
        it: {
          title: 'Chi siamo – MarketFee, calcolatori di commissioni',
          desc: 'MarketFee è una raccolta indipendente e gratuita di calcolatori di commissioni per i marketplace che i grandi strumenti ignorano.',
          h1: 'Chi siamo',
          body: [
            ['Perché esiste',
              'Quasi tutti i calcolatori di commissioni sul web coprono gli stessi tre marketplace: Amazon, eBay ed Etsy. Chi vende su Cdiscount, Fnac, Kaufland, OTTO, bol, Rakuten, Yahoo! Shopping o Coupang resta con un PDF di aliquote e la calcolatrice, spesso in una lingua che non legge.',
              'MarketFee colma questo vuoto. Ogni marketplace qui è uno che gli strumenti mainstream saltano, e ogni calcolatore è scritto nella lingua dei suoi venditori.'],
            ['Come nascono i numeri',
              'Ogni marketplace ha il proprio modello di costi, e le differenze pesano più dell’aliquota dichiarata. Cdiscount calcola sul prezzo IVA inclusa più spedizione. Fnac varia l’aliquota per categoria e condizione del prodotto. OTTO aggiunge il 16 % sulla spedizione pagata dal cliente. TikTok Shop dichiara le aliquote già comprensive di imposte.',
              'Ogni calcolatore riproduce queste regole singolarmente invece di applicare una formula unica. Le aliquote provengono dai listini ufficiali e da guide per venditori affermate; ogni pagina cita le proprie fonti.'],
            ['Cosa non facciamo',
              'Non vendiamo software, non prendiamo commissioni di affiliazione dai marketplace e non ordiniamo nessuno in base a chi paga. Se un confronto mostra che un marketplace accredita di più, è aritmetica, non una raccomandazione.',
              'Non serve registrarsi. Nessun account, nessuna raccolta di email, e niente di ciò che digiti lascia il tuo browser.'],
            ['Accuratezza e correzioni',
              'I marketplace cambiano spesso le commissioni, a volte con poco preavviso. Le aliquote qui sono un punto di partenza, non un vangelo, e sono tutte modificabili: inserisci pure il numero che vedi nel tuo account venditore.',
              'Se trovi un’aliquota sbagliata o superata, segnalacelo indicando dove hai visto quella corretta. Le correzioni sono i messaggi più utili che riceviamo.']
          ]
        },
        es: {
          title: 'Acerca de MarketFee – quién hace estas calculadoras',
          desc: 'MarketFee es un conjunto independiente y gratuito de calculadoras de comisiones para los marketplaces que las grandes herramientas ignoran.',
          h1: 'Acerca de MarketFee',
          body: [
            ['Por qué existe',
              'Casi todas las calculadoras de comisiones de la web cubren los mismos tres marketplaces: Amazon, eBay y Etsy. Si vendes en Cdiscount, Fnac, Kaufland, OTTO, bol, Rakuten, Yahoo! Shopping o Coupang, te quedas con un PDF de tarifas y tu propia calculadora, a menudo en un idioma que no lees.',
              'MarketFee cubre ese hueco. Cada marketplace aquí es uno que las herramientas populares se saltan, y cada calculadora está escrita en el idioma de sus vendedores.'],
            ['Cómo se producen los números',
              'Cada marketplace tiene su propio modelo de tarifas, y las diferencias pesan más que el porcentaje anunciado. Cdiscount calcula sobre el precio con IVA más el envío. Fnac varía la tarifa según categoría y estado del producto. OTTO añade un 16 % sobre el envío que paga el cliente. TikTok Shop publica sus tarifas ya con impuestos incluidos.',
              'Cada calculadora reproduce estas reglas por separado en lugar de aplicar una fórmula única. Las tarifas salen de las tablas oficiales y de guías de vendedores consolidadas; cada página cita sus fuentes.'],
            ['Lo que no hacemos',
              'No vendemos software, no recibimos comisiones de afiliación de los marketplaces y no ordenamos a nadie según lo que pague. Si una comparación muestra que un marketplace deja más, eso es aritmética, no una recomendación.',
              'No hace falta registrarse. Sin cuentas, sin recogida de correos, y nada de lo que escribes sale de tu navegador.'],
            ['Exactitud y correcciones',
              'Los marketplaces cambian sus tarifas a menudo, a veces con poco aviso. Las tarifas de aquí son un punto de partida, no un dogma, y todas son editables: pon el número que aparece en tu propia cuenta de vendedor.',
              'Si encuentras una tarifa equivocada o desfasada, dínoslo indicando dónde viste la correcta. Las correcciones son los mensajes más útiles que recibimos.']
          ]
        }
      }
    },

    privacy: {
      slug: { en: 'privacy', de: 'datenschutz', fr: 'confidentialite', it: 'privacy', es: 'privacidad', nl: 'privacy', ja: 'privacy', ko: 'privacy' },
      s: {
        en: {
          title: 'Privacy policy – MarketFee',
          desc: 'What MarketFee measures, what it never collects, and how advertising and hosting providers fit in. No cookies for analytics, no accounts, no personal data.',
          h1: 'Privacy policy',
          body: [
            ['The short version',
              'Nothing you type into a calculator is sent to us. Prices, costs and margins are processed entirely inside your browser and never reach a server. We do not ask for your name or email, and there is nothing to sign up for.'],
            ['What we measure',
              'To understand which pages are useful we record a single anonymous event when you leave a page. It contains the page address, its language, the country your request came from, how many seconds you stayed, how far you scrolled, whether you changed any calculator field and how many times, and whether you opened the advanced settings or a FAQ entry.',
              'That event carries no identifier of any kind. There is no cookie, no device fingerprint and no account, so the records cannot be linked to you or to each other. We cannot tell whether two visits came from the same person.'],
            ['What stays on your device',
              'The calculator remembers the figures you last entered so you do not have to retype them when you move between marketplaces. That is kept in your browser\'s local storage on your own device. It is never transmitted anywhere, and clearing your browser data removes it. The reset button on any calculator clears it immediately.'],
            ['Service providers',
              'The site is hosted by Cloudflare, which processes requests and provides aggregate traffic statistics. Cloudflare Web Analytics is used alongside our own measurement and does not use cookies.',
              'We display advertising through Google AdSense. Google and its partners may use cookies or similar technologies to serve and measure ads, and may personalise them based on your prior visits to this and other sites. You can review and change these choices at Google\'s Ads Settings, and opt out of personalised advertising from participating companies through the industry opt-out pages.'],
            ['Your rights',
              'Because we hold no personal data and no identifiers, we hold nothing that could be retrieved, corrected or deleted on request. For data held by Google or Cloudflare, their own privacy policies and controls apply.',
              'If you have a question about any of this, the contact page tells you how to reach us.'],
            ['Changes',
              'If this policy changes we will update the date shown at the bottom of this page. Material changes will be described here rather than made quietly.']
          ]
        },
        ko: {
          title: '개인정보처리방침 – MarketFee',
          desc: 'MarketFee가 무엇을 측정하고 무엇을 수집하지 않는지, 광고·호스팅 업체는 어떻게 관여하는지 설명합니다. 분석용 쿠키 없음, 계정 없음, 개인정보 없음.',
          h1: '개인정보처리방침',
          body: [
            ['요약',
              '계산기에 입력하신 내용은 저희에게 전송되지 않습니다. 판매가, 원가, 마진은 전부 브라우저 안에서 처리되며 서버에 도달하지 않습니다. 이름이나 이메일을 묻지 않고, 가입할 것도 없습니다.'],
            ['무엇을 측정하나',
              '어느 페이지가 쓸모 있는지 파악하기 위해, 페이지를 떠날 때 익명 기록 한 건을 남깁니다. 여기에는 페이지 주소, 언어, 요청이 들어온 국가, 머문 초, 스크롤한 정도, 계산기 입력칸을 바꿨는지와 몇 번 바꿨는지, 상세 설정이나 FAQ를 열었는지가 담깁니다.',
              '이 기록에는 어떤 식별자도 들어가지 않습니다. 쿠키도, 기기 지문도, 계정도 없어서 기록을 개인과 연결하거나 기록끼리 묶을 수 없습니다. 두 번의 방문이 같은 사람인지조차 저희는 알 수 없습니다.'],
            ['기기에 남는 것',
              '마켓을 옮겨 다닐 때 같은 숫자를 다시 입력하지 않으셔도 되도록, 마지막에 넣은 값을 기억합니다. 이 값은 본인 기기의 브라우저 저장소에만 있습니다. 어디로도 전송되지 않으며 브라우저 데이터를 지우면 사라집니다. 계산기의 초기화 버튼을 누르면 즉시 삭제됩니다.'],
            ['서비스 제공업체',
              '이 사이트는 Cloudflare에서 호스팅되며, Cloudflare가 요청을 처리하고 집계 트래픽 통계를 제공합니다. Cloudflare Web Analytics도 함께 사용하며 쿠키를 쓰지 않습니다.',
              '광고는 Google AdSense를 통해 표시합니다. Google과 그 파트너는 광고를 게재하고 측정하기 위해 쿠키나 유사 기술을 사용할 수 있으며, 이 사이트와 다른 사이트의 이전 방문을 바탕으로 광고를 맞춤화할 수 있습니다. 이 설정은 Google 광고 설정에서 확인하고 변경할 수 있고, 참여 업체의 맞춤 광고는 업계 차단 페이지에서 거부할 수 있습니다.'],
            ['이용자의 권리',
              '저희는 개인정보도 식별자도 보관하지 않으므로, 요청에 따라 열람·정정·삭제할 대상 자체가 없습니다. Google이나 Cloudflare가 보유하는 데이터는 각 사의 개인정보처리방침과 설정이 적용됩니다.',
              '문의하실 내용이 있으면 연락처 페이지에 연락 방법이 적혀 있습니다.'],
            ['변경',
              '이 방침이 바뀌면 이 페이지 하단의 날짜를 갱신합니다. 중요한 변경은 조용히 넘기지 않고 여기에 설명합니다.']
          ]
        },
        ja: {
          title: 'プライバシーポリシー – MarketFee',
          desc: 'MarketFeeが何を計測し何を収集しないか、広告・ホスティング事業者がどう関わるかを説明します。解析用クッキーなし、アカウントなし、個人情報なし。',
          h1: 'プライバシーポリシー',
          body: [
            ['要点',
              '計算ツールに入力された内容が当サイトに送信されることはありません。販売価格・原価・利益はすべてブラウザ内で処理され、サーバーに届きません。氏名やメールアドレスを尋ねることもなく、登録するものもありません。'],
            ['計測する内容',
              'どのページが役に立っているかを把握するため、ページを離れるときに匿名の記録を1件だけ残します。含まれるのは、ページのアドレス、言語、リクエストの発信国、滞在秒数、スクロールの到達度、計算ツールの入力を変更したかとその回数、詳細設定やよくある質問を開いたかどうかです。',
              'この記録にはいかなる識別子も含まれません。クッキーも端末フィンガープリントもアカウントもないため、記録を個人に結びつけることも、記録同士を紐づけることもできません。2回の訪問が同一人物かどうかも当サイトには分かりません。'],
            ['端末に残るもの',
              'モールを移動するたびに同じ数字を入力し直さずに済むよう、最後に入力した値を記憶します。この値はご自身の端末のブラウザ内ストレージにのみ保存されます。どこにも送信されず、ブラウザのデータを消去すれば消えます。計算ツールのリセットボタンを押せば即座に削除されます。'],
            ['サービス提供事業者',
              '当サイトはCloudflareでホスティングされており、Cloudflareがリクエストを処理し集計トラフィック統計を提供します。Cloudflare Web Analyticsも併用しており、クッキーは使用しません。',
              '広告はGoogle AdSenseを通じて表示します。Googleおよびそのパートナーは、広告の配信と測定のためにクッキーまたは類似技術を使用することがあり、当サイトや他サイトへの過去の訪問に基づいて広告をパーソナライズする場合があります。これらの設定はGoogleの広告設定で確認・変更でき、参加事業者によるパーソナライズ広告は業界のオプトアウトページで拒否できます。'],
            ['利用者の権利',
              '当サイトは個人情報も識別子も保持していないため、請求に応じて開示・訂正・削除すべき対象がそもそも存在しません。GoogleやCloudflareが保持するデータについては、各社のプライバシーポリシーと設定が適用されます。',
              'ご不明な点があれば、お問い合わせページに連絡方法を記載しています。'],
            ['変更',
              '本ポリシーを変更した場合は、このページ下部の日付を更新します。重要な変更は黙って行わず、ここで説明します。']
          ]
        },
        de: {
          title: 'Datenschutzerklärung – MarketFee',
          desc: 'Was MarketFee misst, was nie erhoben wird und welche Rolle Werbe- und Hosting-Dienste spielen. Keine Analyse-Cookies, keine Konten, keine Personendaten.',
          h1: 'Datenschutzerklärung',
          body: [
            ['Kurzfassung',
              'Nichts, was Sie in einen Rechner eintippen, wird an uns gesendet. Preise, Kosten und Margen werden vollständig in Ihrem Browser verarbeitet und erreichen keinen Server. Wir fragen weder Namen noch E-Mail-Adresse ab, und es gibt nichts zu registrieren.'],
            ['Was wir messen',
              'Um zu verstehen, welche Seiten nützlich sind, erfassen wir beim Verlassen einer Seite ein einziges anonymes Ereignis. Es enthält die Seitenadresse, deren Sprache, das Land der Anfrage, die Verweildauer in Sekunden, wie weit gescrollt wurde, ob und wie oft ein Feld des Rechners geändert wurde und ob die erweiterten Einstellungen oder ein FAQ-Eintrag geöffnet wurden.',
              'Dieses Ereignis enthält keinerlei Kennung. Es gibt kein Cookie, keinen Geräte-Fingerabdruck und kein Konto, daher lassen sich die Datensätze weder Ihnen noch einander zuordnen. Wir können nicht erkennen, ob zwei Besuche von derselben Person stammen.'],
            ['Was auf Ihrem Gerät bleibt',
              'Der Rechner merkt sich die zuletzt eingegebenen Zahlen, damit Sie sie beim Wechsel zwischen Marktplätzen nicht erneut eintippen müssen. Das liegt im lokalen Speicher Ihres Browsers auf Ihrem eigenen Gerät. Es wird nirgendwohin übertragen, und das Löschen der Browserdaten entfernt es. Die Zurücksetzen-Schaltfläche in jedem Rechner löscht es sofort.'],
            ['Dienstleister',
              'Die Seite wird von Cloudflare gehostet, das die Anfragen verarbeitet und aggregierte Zugriffsstatistiken bereitstellt. Cloudflare Web Analytics wird ergänzend eingesetzt und verwendet keine Cookies.',
              'Werbung zeigen wir über Google AdSense aus. Google und seine Partner können Cookies oder ähnliche Technologien einsetzen, um Anzeigen auszuliefern und zu messen, und diese anhand Ihrer früheren Besuche auf dieser und anderen Websites personalisieren. Sie können diese Einstellungen in den Google-Anzeigeneinstellungen prüfen und ändern und personalisierte Werbung teilnehmender Unternehmen über die Opt-out-Seiten der Branche abbestellen.'],
            ['Ihre Rechte',
              'Da wir weder personenbezogene Daten noch Kennungen vorhalten, existiert nichts, was auf Anfrage herausgegeben, berichtigt oder gelöscht werden könnte. Für Daten bei Google oder Cloudflare gelten deren eigene Datenschutzerklärungen und Einstellungen.',
              'Bei Fragen finden Sie auf der Kontaktseite, wie Sie uns erreichen.'],
            ['Änderungen',
              'Ändert sich diese Erklärung, aktualisieren wir das Datum am Seitenende. Wesentliche Änderungen beschreiben wir hier, statt sie still vorzunehmen.']
          ]
        },
        fr: {
          title: 'Politique de confidentialité – MarketFee',
          desc: 'Ce que MarketFee mesure, ce qu’il ne collecte jamais, et le rôle des prestataires. Pas de cookies d’analyse, pas de comptes, pas de données personnelles.',
          h1: 'Politique de confidentialité',
          body: [
            ['En bref',
              'Rien de ce que vous saisissez dans un calculateur ne nous est envoyé. Prix, coûts et marges sont traités entièrement dans votre navigateur et n’atteignent aucun serveur. Nous ne demandons ni nom ni adresse e-mail, et il n’y a rien à créer comme compte.'],
            ['Ce que nous mesurons',
              'Pour comprendre quelles pages sont utiles, nous enregistrons un unique événement anonyme au moment où vous quittez une page. Il contient l’adresse de la page, sa langue, le pays d’origine de la requête, le nombre de secondes passées, la profondeur de défilement, si et combien de fois un champ du calculateur a été modifié, et si les paramètres avancés ou une question fréquente ont été ouverts.',
              'Cet événement ne porte aucun identifiant. Pas de cookie, pas d’empreinte d’appareil, pas de compte : les enregistrements ne peuvent être rattachés ni à vous ni les uns aux autres. Nous ne pouvons pas savoir si deux visites viennent de la même personne.'],
            ['Ce qui reste sur votre appareil',
              'Le calculateur retient les derniers chiffres saisis pour vous éviter de les retaper en passant d’une marketplace à l’autre. Cela reste dans le stockage local de votre navigateur, sur votre appareil. Rien n’est transmis, et effacer les données de navigation le supprime. Le bouton de réinitialisation de chaque calculateur l’efface immédiatement.'],
            ['Prestataires',
              'Le site est hébergé par Cloudflare, qui traite les requêtes et fournit des statistiques de trafic agrégées. Cloudflare Web Analytics est utilisé en complément de notre propre mesure et n’emploie pas de cookies.',
              'Nous diffusons de la publicité via Google AdSense. Google et ses partenaires peuvent utiliser des cookies ou technologies similaires pour diffuser et mesurer les annonces, et les personnaliser selon vos visites antérieures sur ce site et d’autres. Vous pouvez consulter et modifier ces choix dans les paramètres des annonces Google, et refuser la publicité personnalisée des sociétés participantes via les pages de désinscription du secteur.'],
            ['Vos droits',
              'Comme nous ne détenons ni données personnelles ni identifiants, il n’existe rien qui puisse être communiqué, rectifié ou supprimé sur demande. Pour les données détenues par Google ou Cloudflare, leurs propres politiques et réglages s’appliquent.',
              'Pour toute question, la page de contact indique comment nous joindre.'],
            ['Modifications',
              'Si cette politique change, nous mettrons à jour la date affichée en bas de page. Les changements importants seront décrits ici plutôt qu’appliqués en silence.']
          ]
        },
        nl: {
          title: 'Privacybeleid – MarketFee',
          desc: 'Wat MarketFee meet, wat het nooit verzamelt en welke rol advertentie- en hostingpartijen spelen. Geen cookies, geen accounts, geen persoonsgegevens.',
          h1: 'Privacybeleid',
          body: [
            ['Kort samengevat',
              'Niets van wat je in een calculator typt wordt naar ons verstuurd. Prijzen, kosten en marges worden volledig in je browser verwerkt en bereiken geen server. We vragen geen naam of e-mailadres, en er valt niets aan te melden.'],
            ['Wat we meten',
              'Om te begrijpen welke pagina’s nuttig zijn, leggen we één anonieme gebeurtenis vast op het moment dat je een pagina verlaat. Die bevat het pagina-adres, de taal, het land waar het verzoek vandaan kwam, het aantal seconden dat je bleef, hoe ver je scrolde, of en hoe vaak je een veld van de calculator wijzigde, en of je de geavanceerde instellingen of een veelgestelde vraag opende.',
              'Die gebeurtenis draagt geen enkele identificatie. Er is geen cookie, geen apparaatvingerafdruk en geen account, dus de records zijn niet aan jou en niet aan elkaar te koppelen. We kunnen niet zien of twee bezoeken van dezelfde persoon komen.'],
            ['Wat op je apparaat blijft',
              'De calculator onthoudt de laatst ingevulde bedragen zodat je ze niet opnieuw hoeft te typen als je tussen marketplaces wisselt. Dat staat in de lokale opslag van je browser, op je eigen apparaat. Het wordt nergens heen gestuurd, en je browsergegevens wissen verwijdert het. De resetknop in elke calculator wist het direct.'],
            ['Dienstverleners',
              'De site wordt gehost door Cloudflare, dat de verzoeken verwerkt en geaggregeerde bezoekstatistieken levert. Cloudflare Web Analytics wordt naast onze eigen meting gebruikt en zet geen cookies.',
              'We tonen advertenties via Google AdSense. Google en zijn partners kunnen cookies of vergelijkbare technieken inzetten om advertenties te tonen en te meten, en die personaliseren op basis van je eerdere bezoeken aan deze en andere sites. Je kunt die keuzes bekijken en wijzigen in de advertentie-instellingen van Google, en gepersonaliseerde advertenties van deelnemende bedrijven afwijzen via de opt-outpagina’s van de sector.'],
            ['Je rechten',
              'Omdat we geen persoonsgegevens en geen identificaties bewaren, is er niets dat op verzoek kan worden verstrekt, gecorrigeerd of verwijderd. Voor gegevens bij Google of Cloudflare gelden hun eigen privacybeleid en instellingen.',
              'Heb je hier een vraag over, dan staat op de contactpagina hoe je ons bereikt.'],
            ['Wijzigingen',
              'Verandert dit beleid, dan werken we de datum onderaan deze pagina bij. Belangrijke wijzigingen beschrijven we hier in plaats van ze stil door te voeren.']
          ]
        },
        it: {
          title: 'Informativa sulla privacy – MarketFee',
          desc: 'Cosa misura MarketFee, cosa non raccoglie mai e il ruolo dei fornitori. Nessun cookie di analisi, nessun account, nessun dato personale.',
          h1: 'Informativa sulla privacy',
          body: [
            ['In breve',
              'Nulla di ciò che digiti in un calcolatore viene inviato a noi. Prezzi, costi e margini sono elaborati interamente nel tuo browser e non raggiungono alcun server. Non chiediamo nome né email, e non c’è nulla a cui iscriversi.'],
            ['Cosa misuriamo',
              'Per capire quali pagine sono utili registriamo un singolo evento anonimo quando lasci una pagina. Contiene l’indirizzo della pagina, la lingua, il paese da cui è arrivata la richiesta, i secondi di permanenza, quanto hai scorso, se e quante volte hai modificato un campo del calcolatore e se hai aperto le impostazioni avanzate o una domanda frequente.',
              'Quell’evento non porta alcun identificativo. Non ci sono cookie, impronte del dispositivo né account, quindi i record non sono collegabili a te né tra loro. Non possiamo sapere se due visite provengono dalla stessa persona.'],
            ['Cosa resta sul tuo dispositivo',
              'Il calcolatore ricorda gli ultimi importi inseriti così non devi riscriverli passando da un marketplace all’altro. Restano nella memoria locale del tuo browser, sul tuo dispositivo. Non vengono trasmessi da nessuna parte e cancellare i dati del browser li rimuove. Il pulsante di reimpostazione di ogni calcolatore li cancella subito.'],
            ['Fornitori di servizi',
              'Il sito è ospitato da Cloudflare, che elabora le richieste e fornisce statistiche di traffico aggregate. Cloudflare Web Analytics è usato insieme alla nostra misurazione e non impiega cookie.',
              'Mostriamo pubblicità tramite Google AdSense. Google e i suoi partner possono usare cookie o tecnologie simili per pubblicare e misurare gli annunci, e personalizzarli in base alle tue visite precedenti a questo e ad altri siti. Puoi rivedere e modificare queste scelte nelle impostazioni annunci di Google e rifiutare la pubblicità personalizzata delle aziende aderenti tramite le pagine di opt-out del settore.'],
            ['I tuoi diritti',
              'Poiché non conserviamo dati personali né identificativi, non esiste nulla che possa essere fornito, corretto o cancellato su richiesta. Per i dati detenuti da Google o Cloudflare valgono le loro informative e impostazioni.',
              'Per qualsiasi domanda, la pagina dei contatti indica come raggiungerci.'],
            ['Modifiche',
              'Se questa informativa cambia aggiorneremo la data in fondo alla pagina. Le modifiche sostanziali saranno descritte qui invece di essere fatte in silenzio.']
          ]
        },
        es: {
          title: 'Política de privacidad – MarketFee',
          desc: 'Qué mide MarketFee, qué nunca recoge y qué papel tienen los proveedores. Sin cookies de análisis, sin cuentas, sin datos personales.',
          h1: 'Política de privacidad',
          body: [
            ['Resumen',
              'Nada de lo que escribes en una calculadora se nos envía. Precios, costes y márgenes se procesan enteramente en tu navegador y no llegan a ningún servidor. No pedimos nombre ni correo, y no hay nada que registrar.'],
            ['Qué medimos',
              'Para saber qué páginas resultan útiles registramos un único evento anónimo cuando abandonas una página. Contiene la dirección de la página, su idioma, el país desde el que llegó la petición, los segundos que permaneciste, hasta dónde te desplazaste, si cambiaste algún campo de la calculadora y cuántas veces, y si abriste los ajustes avanzados o una pregunta frecuente.',
              'Ese evento no lleva ningún identificador. No hay cookie, ni huella de dispositivo, ni cuenta, así que los registros no pueden vincularse contigo ni entre sí. No podemos saber si dos visitas vienen de la misma persona.'],
            ['Qué queda en tu dispositivo',
              'La calculadora recuerda las últimas cifras introducidas para que no tengas que volver a escribirlas al cambiar de marketplace. Eso se guarda en el almacenamiento local de tu navegador, en tu propio dispositivo. No se transmite a ninguna parte y borrar los datos del navegador lo elimina. El botón de restablecer de cualquier calculadora lo borra al instante.'],
            ['Proveedores de servicios',
              'El sitio está alojado en Cloudflare, que procesa las peticiones y facilita estadísticas de tráfico agregadas. Cloudflare Web Analytics se usa junto a nuestra propia medición y no emplea cookies.',
              'Mostramos publicidad mediante Google AdSense. Google y sus socios pueden usar cookies o tecnologías similares para publicar y medir anuncios, y personalizarlos según tus visitas anteriores a este y otros sitios. Puedes revisar y cambiar estas opciones en la configuración de anuncios de Google, y rechazar la publicidad personalizada de las empresas participantes mediante las páginas de exclusión del sector.'],
            ['Tus derechos',
              'Como no conservamos datos personales ni identificadores, no existe nada que podamos entregar, corregir o borrar a petición. Para los datos que tengan Google o Cloudflare rigen sus propias políticas y ajustes.',
              'Si tienes alguna duda, la página de contacto indica cómo escribirnos.'],
            ['Cambios',
              'Si esta política cambia, actualizaremos la fecha que aparece al final de la página. Los cambios importantes se describirán aquí en lugar de aplicarse en silencio.']
          ]
        }
      }
    },

    contact: {
      slug: { en: 'contact', de: 'kontakt', fr: 'contact', it: 'contatti', es: 'contacto', nl: 'contact', ja: 'contact', ko: 'contact' },
      s: {
        en: {
          title: 'Contact MarketFee – report a wrong fee rate',
          desc: 'How to report a fee rate that is wrong or out of date, ask for a marketplace to be added, or raise anything else about MarketFee.',
          h1: 'Contact',
          body: [
            ['Write to us', 'Email: {EMAIL}', 'We read everything, though a reply may take a few days.'],
            ['Reporting a wrong rate',
              'This is the most valuable message you can send. Marketplaces change fees regularly and we do not always catch it.',
              'Please include the marketplace, the category, the rate you believe is correct and where you saw it — a screenshot of your seller account or a link to the official fee schedule is ideal. With that we can usually correct a page the same day.'],
            ['Requesting a marketplace',
              'If a marketplace you sell on is missing, tell us which one and, if you can, point us at its published fee schedule. The marketplaces here were chosen because their fee tables are public and detailed enough to model honestly; the ones we have left out are mostly those that do not publish complete rates.'],
            ['Everything else',
              'Questions about how a calculation works, corrections to a translation, or a bug in the site are all welcome. The source code is public if you would rather open an issue there.']
          ]
        },
        ko: {
          title: '연락처 – MarketFee',
          desc: '잘못된 수수료율 제보, 마켓 추가 요청, 그 밖의 문의 방법을 안내합니다.',
          h1: '연락처',
          body: [
            ['메일 주소', '이메일: {EMAIL}', '보내주신 내용은 모두 읽습니다. 다만 답장까지 며칠 걸릴 수 있습니다.'],
            ['틀린 요율 제보',
              '가장 도움이 되는 연락입니다. 마켓은 수수료를 수시로 바꾸고, 저희가 매번 알아차리지는 못합니다.',
              '마켓 이름, 카테고리, 맞다고 보시는 요율, 그리고 그 숫자를 어디서 보셨는지를 같이 적어주세요. 판매자 센터 화면이나 공식 수수료표 링크가 있으면 가장 좋습니다. 그 정도면 보통 당일에 고칠 수 있습니다.'],
            ['마켓 추가 요청',
              '판매 중인 마켓이 빠져 있다면 어느 마켓인지 알려주세요. 가능하면 공개된 수수료표 위치도 함께 알려주시면 좋습니다. 여기 있는 마켓들은 수수료표가 공개돼 있고 정직하게 구현할 만큼 자세해서 고른 곳입니다. 빠진 곳은 대부분 요율을 온전히 공개하지 않는 마켓입니다.'],
            ['그 밖의 문의',
              '계산 방식에 대한 질문, 번역 오류 지적, 사이트 버그 제보 모두 환영합니다. 소스 코드가 공개돼 있으니 그쪽에 이슈를 남기셔도 됩니다.']
          ]
        },
        ja: {
          title: 'お問い合わせ – MarketFee',
          desc: '料率の誤りのご報告、モール追加のご要望、その他のお問い合わせ方法をご案内します。',
          h1: 'お問い合わせ',
          body: [
            ['メールアドレス', 'メール: {EMAIL}', 'いただいた内容にはすべて目を通しています。ただし返信までに数日かかることがあります。'],
            ['料率の誤りのご報告',
              '最もありがたいご連絡です。モールは手数料を頻繁に変更し、当サイトが毎回気づけるわけではありません。',
              'モール名、カテゴリ、正しいと思われる料率、そしてその数字をどこで見たかを併せてお知らせください。管理画面のスクリーンショットや公式の手数料表へのリンクがあれば最適です。それだけあれば、多くの場合その日のうちに修正できます。'],
            ['モール追加のご要望',
              '出店しているモールが見当たらない場合は、どのモールかをお知らせください。公開されている手数料表の場所も教えていただけると助かります。ここにあるモールは、手数料表が公開されており誠実に実装できるだけの詳しさがあるものを選んでいます。外しているのは、料率を完全には公開していないモールがほとんどです。'],
            ['その他',
              '計算方法についてのご質問、翻訳の誤りのご指摘、サイトの不具合のご報告、いずれも歓迎します。ソースコードを公開しているので、そちらに issue を立てていただいても構いません。']
          ]
        },
        de: {
          title: 'Kontakt MarketFee – falschen Gebührensatz melden',
          desc: 'Wie Sie einen Gebührensatz melden, der falsch oder veraltet ist, einen Marktplatz vorschlagen oder uns sonst erreichen.',
          h1: 'Kontakt',
          body: [
            ['Schreiben Sie uns', 'E-Mail: {EMAIL}', 'Wir lesen alles, eine Antwort kann aber ein paar Tage dauern.'],
            ['Falschen Satz melden',
              'Das ist die wertvollste Nachricht, die Sie schicken können. Marktplätze ändern Gebühren regelmäßig, und wir bekommen das nicht immer mit.',
              'Bitte nennen Sie Marktplatz, Kategorie, den aus Ihrer Sicht richtigen Satz und wo Sie ihn gesehen haben – ein Screenshot aus Ihrem Händlerkonto oder ein Link zur offiziellen Gebührentabelle ist ideal. Damit lässt sich eine Seite meist am selben Tag korrigieren.'],
            ['Marktplatz vorschlagen',
              'Fehlt ein Marktplatz, auf dem Sie verkaufen, sagen Sie uns welcher und verweisen Sie nach Möglichkeit auf dessen veröffentlichte Gebührentabelle. Die hier vertretenen Marktplätze wurden gewählt, weil ihre Gebühren öffentlich und detailliert genug sind, um sie ehrlich abzubilden; ausgelassen haben wir vor allem jene, die keine vollständigen Sätze veröffentlichen.'],
            ['Alles andere',
              'Fragen zur Berechnung, Hinweise auf Übersetzungsfehler oder Fehlermeldungen zur Seite sind willkommen. Der Quellcode ist öffentlich, falls Sie lieber dort ein Issue eröffnen.']
          ]
        },
        fr: {
          title: 'Contact MarketFee – signaler un taux erroné',
          desc: 'Comment signaler un taux de commission erroné ou périmé, proposer une marketplace ou nous poser toute autre question.',
          h1: 'Contact',
          body: [
            ['Écrivez-nous', 'E-mail : {EMAIL}', 'Nous lisons tout, même si une réponse peut prendre quelques jours.'],
            ['Signaler un taux erroné',
              'C’est le message le plus utile que vous puissiez envoyer. Les marketplaces modifient régulièrement leurs frais et nous ne le repérons pas toujours.',
              'Merci d’indiquer la marketplace, la catégorie, le taux que vous pensez correct et où vous l’avez vu — une capture de votre espace vendeur ou un lien vers la grille officielle est l’idéal. Avec cela, une page peut généralement être corrigée le jour même.'],
            ['Proposer une marketplace',
              'S’il manque une marketplace sur laquelle vous vendez, dites-nous laquelle et, si possible, indiquez où sa grille tarifaire est publiée. Les marketplaces présentes ici ont été retenues parce que leurs frais sont publics et assez détaillés pour être modélisés honnêtement ; celles que nous avons écartées sont surtout celles qui ne publient pas de taux complets.'],
            ['Le reste',
              'Questions sur le fonctionnement d’un calcul, corrections de traduction ou bugs du site sont les bienvenus. Le code source est public si vous préférez y ouvrir un ticket.']
          ]
        },
        nl: {
          title: 'Contact MarketFee – meld een verkeerd tarief',
          desc: 'Hoe je een tarief meldt dat fout of verouderd is, een marketplace voorstelt of ons iets anders vraagt.',
          h1: 'Contact',
          body: [
            ['Schrijf ons', 'E-mail: {EMAIL}', 'We lezen alles, al kan een antwoord een paar dagen duren.'],
            ['Een verkeerd tarief melden',
              'Dit is het nuttigste bericht dat je kunt sturen. Marketplaces wijzigen hun tarieven regelmatig en dat ontgaat ons niet altijd.',
              'Vermeld de marketplace, de categorie, het tarief dat volgens jou klopt en waar je het zag — een schermafbeelding uit je verkoopaccount of een link naar de officiële tarievenlijst is ideaal. Daarmee kunnen we een pagina meestal dezelfde dag corrigeren.'],
            ['Een marketplace voorstellen',
              'Ontbreekt de marketplace waarop je verkoopt, laat weten welke en wijs ons zo mogelijk op de gepubliceerde tarievenlijst. De marketplaces hier zijn gekozen omdat hun tarieven openbaar en gedetailleerd genoeg zijn om eerlijk na te bouwen; wat we hebben overgeslagen zijn vooral partijen die geen volledige tarieven publiceren.'],
            ['Al het andere',
              'Vragen over hoe een berekening werkt, correcties op een vertaling of een bug op de site zijn welkom. De broncode is openbaar als je daar liever een issue opent.']
          ]
        },
        it: {
          title: 'Contatti MarketFee – segnala un’aliquota errata',
          desc: 'Come segnalare un’aliquota sbagliata o superata, proporre un marketplace o farci qualsiasi altra domanda.',
          h1: 'Contatti',
          body: [
            ['Scrivici', 'Email: {EMAIL}', 'Leggiamo tutto, anche se una risposta può richiedere qualche giorno.'],
            ['Segnalare un’aliquota errata',
              'È il messaggio più utile che tu possa inviare. I marketplace cambiano le commissioni di frequente e non sempre ce ne accorgiamo.',
              'Indica il marketplace, la categoria, l’aliquota che ritieni corretta e dove l’hai vista: uno screenshot del tuo account venditore o un link al listino ufficiale è l’ideale. Con questo di solito correggiamo una pagina in giornata.'],
            ['Proporre un marketplace',
              'Se manca un marketplace su cui vendi, dicci quale e, se puoi, indicaci dove pubblica il listino. I marketplace presenti sono stati scelti perché le loro commissioni sono pubbliche e abbastanza dettagliate da poter essere riprodotte onestamente; quelli esclusi sono soprattutto quelli che non pubblicano aliquote complete.'],
            ['Tutto il resto',
              'Domande su come funziona un calcolo, correzioni a una traduzione o bug del sito sono benvenuti. Il codice sorgente è pubblico, se preferisci aprire lì una segnalazione.']
          ]
        },
        es: {
          title: 'Contacto MarketFee – informar de una tarifa errónea',
          desc: 'Cómo informar de una tarifa incorrecta o desfasada, proponer un marketplace o preguntarnos cualquier otra cosa.',
          h1: 'Contacto',
          body: [
            ['Escríbenos', 'Correo: {EMAIL}', 'Leemos todo, aunque la respuesta puede tardar unos días.'],
            ['Informar de una tarifa incorrecta',
              'Es el mensaje más valioso que puedes enviar. Los marketplaces cambian sus comisiones con frecuencia y no siempre lo detectamos.',
              'Indica el marketplace, la categoría, la tarifa que crees correcta y dónde la viste: una captura de tu cuenta de vendedor o un enlace a la tabla oficial es lo ideal. Con eso solemos corregir una página el mismo día.'],
            ['Proponer un marketplace',
              'Si falta un marketplace en el que vendes, dinos cuál y, si puedes, señálanos dónde publica sus tarifas. Los marketplaces que hay aquí se eligieron porque sus comisiones son públicas y lo bastante detalladas para reproducirlas con honestidad; los que hemos dejado fuera son sobre todo los que no publican tarifas completas.'],
            ['Todo lo demás',
              'Preguntas sobre cómo funciona un cálculo, correcciones de traducción o errores del sitio son bienvenidos. El código fuente es público, por si prefieres abrir allí una incidencia.']
          ]
        }
      }
    }
  };
})(typeof window !== 'undefined' ? window : global);
