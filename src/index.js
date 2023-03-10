import puppeteer from 'puppeteer';

const fetchProductConsum = async (url) => {
    const browser = await puppeteer.launch({headless: true});
    try {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        //await page.waitForNavigation()
        //await page.screenshot({ path: 'consum.png' });
        //await page.waitForSelector('#infoproduct-content--name');
        const res = await page.evaluate(() => {
            const offerPriceEl = document.querySelector('#infoproduct-content--offerprice')
            const brandEl = document.querySelector('#infoproduct-content--brand')

            const data = {
                name: document.querySelector('#infoproduct-content--name h1').innerText,
                price: document.querySelector('#infoproduct-content--price').innerText,
                offerPrice: offerPriceEl ? offerPriceEl.innerText : null,
                unitPrice: document.querySelector('#infoproduct-content--unitprice > span').innerText,
                code: document.querySelector('#infoproduct-content--code').innerText.split(' ')[2],
                brand: brandEl ? brandEl.innerText : null,
        }
        return data;
    })
        console.log(res)
    } catch (error) {
        console.log(error);
    } finally {
        await browser.close();
    }
}

fetchProductConsum('https://tienda.consum.es/es/p/huevo-campero-m-decena/7359040')