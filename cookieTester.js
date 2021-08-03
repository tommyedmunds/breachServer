const puppeteer = require('puppeteer');

const cookieController = {};

cookieController.cookieTester = async (req, res, next) => {
  let browser;
  console.log(req);
  try {
    let url = req.body.url;

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    const client = await page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');
    await client.send('Network.clearBrowserCache');

    // //const content = await page.content();

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 });

    await page.evaluate((_) => {
      function xcc_contains(selector, text) {
        var elements = document.querySelectorAll(selector);
        return Array.prototype.filter.call(elements, function (element) {
          return RegExp(text, 'i').test(element.textContent.trim());
        });
      }
      var _xcc;
      _xcc = xcc_contains(
        '[id*=cookie] a, [class*=cookie] a, [id*=cookie] button, [class*=cookie] button',
        '^(Alle akzeptieren|Akzeptieren|Verstanden|Zustimmen|Okay|OK)$'
      );
      if (_xcc != null && _xcc.length != 0) {
        _xcc[0].click();
      }
    });

    var content = await page._client.send('Network.getAllCookies');

    console.log(content);

    console.log('here');
    await browser.close();
    res.locals.cookieResult = content.cookies;
    return next();
  } catch (e) {
    console.log(e);
    await browser.close();
    return next();
  }
};

module.exports = cookieController;
