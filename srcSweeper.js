const puppeteer = require('puppeteer');

const links = {
  links: [],
};

links.getLinks = async (req, res, next) => {
  links.links = [];
  try {
    let url = req.body.url;
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 120000,
    });

    const scripts = await page.evaluate(() =>
      Array.from(document.getElementsByTagName('script'), (e) => e.src)
    );

    scripts.forEach((l) => {
      if (l !== '' && !l.includes('https://www.google-analytics')) {
        links.links.push(l);
      }
    });

    await browser.close();
    res.locals.scriptLinks = links.links;
    console.log(links.links);
    return next();
  } catch (e) {
    console.log(e);
    await browser.close();
    return next(e);
  }
};

module.exports = links;
