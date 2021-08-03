const puppeteer = require('puppeteer');

const links = require('./srcSweeper');

const loop = {};

loop.getHTMLcount = async (req, res, next) => {
  const regex = /innerHTML/g;

  let done = false;
  res.locals.innerHTMLcount = 0;
  try {
    let counter = 0;
    const puppet = async (arr, count = 0) => {
      if (arr[count] === undefined) {
        console.log(counter.length);
        res.locals.innerHTMLcount = 0;
        res.locals.innerHTMLcount = counter;

        return next();
      }

      if (arr[count] === '') return puppet(arr, count + 1);

      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
      await page.goto(arr[count], {
        waitUntil: 'domcontentloaded',
        timeout: 120000,
      });

      const content = await page.content();

      //console.log(content);

      counter += (content.match(/innerHTML/g) || []).length;

      //   if (content.match(/innerHTML/g)) {
      //     counter += 1;
      //   }

      await browser.close();
      // if (counter === null) {
      //   counter = 0;
      // }
      console.log('42 ', counter);
      return puppet(arr, count + 1);
    };

    puppet(links.links);
  } catch (e) {
    console.log(e);
    await browser.close();
    return next(e);
  }
};

module.exports = loop;
