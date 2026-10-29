/* ============================================================================
 *  SAI SIJE — obsah stránky  /  网站内容
 *  ----------------------------------------------------------------------------
 *  TOTO JE JEDINÝ SÚBOR, KTORÝ TREBA UPRAVOVAŤ.
 *  这里是唯一需要修改的文件：改价格、加项目、改电话都在这里。
 *
 *  Ako upraviť cenu / 怎么改价格：
 *    1. Nájdite položku, napr. { name: 'Skrátenie nohavíc', price: 'od 8 €' }
 *    2. Zmeňte text v úvodzovkách za price, napr. 'od 9 €'
 *    3. Uložte súbor a nahrajte ho späť na GitHub (alebo Cloudflare).
 *
 *  Cena môže byť hocijaký text: 'od 8 €', '12 €', 'na vyžiadanie', 'cca 10 €'.
 *  价格可以写任意文字：「od 8 €」「12 €」「na vyžiadanie」。
 * ========================================================================== */

window.SAI_SIJE = {
  name: 'Sai sije',
  tagline: 'Opravy a úpravy odevov a tašiek',
  lead: 'Skracujeme, zužujeme a opravujeme oblečenie aj tašky. Pracujeme rýchlo a s ohľadom na materiál.',

  address: 'Krížna 26, Bratislava',
  hours: 'Denne 8:00 – 20:00',
  phone: '+421 903 143 758',
  phoneHref: '+421903143758',
  whatsapp: '421903143758',
  note: 'Vyzdvihnutie a doručenie po dohode.',

  /* Sociálne siete / 社交账号 — ak URL necháte prázdne, odkaz sa nezobrazí.
     留空就不显示该链接。 */
  social: [
    { label: 'Facebook', url: '' },
    { label: 'Instagram', url: '' }
  ],

  /* Cenník / 价格表 */
  categories: [
    {
      title: 'Opravy a úpravy',
      note: 'Bežné úpravy hotové do 2–3 dní.',
      items: [
        { name: 'Skrátenie nohavíc', price: 'od 8 €' },
        { name: 'Skrátenie rukávov', price: 'od 8 €' },
        { name: 'Zúženie nohavíc', price: 'od 12 €' },
        { name: 'Zúženie šiat', price: 'od 15 €' },
        { name: 'Výmena zipsu', price: 'od 10 €' },
        { name: 'Oprava roztrhnutého švu', price: 'od 5 €' },
        { name: 'Látanie a zašívanie dier', price: 'od 5 €' },
        { name: 'Výmena gombíka', price: 'od 2 €' },
        { name: 'Nová podšívka', price: 'od 20 €' }
      ]
    },
    {
      title: 'Tašky a batohy',
      note: 'Oprava aj šitie na mieru.',
      items: [
        { name: 'Oprava tašky alebo batoha', price: 'od 8 €' },
        { name: 'Výmena zipsu na taške', price: 'od 12 €' },
        { name: 'Šitie tašky na mieru', price: 'od 25 €' }
      ]
    }
  ]
};
