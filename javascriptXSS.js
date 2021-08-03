const puppeteer = require('puppeteer');

const javascriptController = {};

javascriptController.javascriptTester = async (req, res, next) => {
  let url = req.body.url;

  let alertHappened = false;
  try {
    url = url.concat(`<img%20src%3D''%20onerror%3D'alert(0)'>`);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // const client = await page.target().createCDPSession();
    // await client.send('Network.clearBrowserCookies');
    // await client.send('Network.clearBrowserCache');

    page.on('dialog', async (dialog) => {
      alertHappened = true;

      console.log('here ', dialog._message);
      res.locals.javascriptResult = alertHappened;
      await browser.close();
      return next();
    });

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 120000,
    });

    //await page.keyboard.press('Enter');

    console.log(url);

    console.log('javascript ', alertHappened);

    res.locals.javascriptResult = alertHappened;
    await browser.close();
    return next();
  } catch (e) {
    console.log(e);
    return next();
  }
};

module.exports = javascriptController;
