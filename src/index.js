import puppeteer from 'puppeteer';

const fetchProductConsum = async (url) => {
    const browser = await puppeteer.launch({headless: true});
    try {
        const page = await browser.newPage();
        await page.setViewport({
            width: 1200,
            height: 800,
            deviceScaleFactor: 1,
          });
        await page.goto(url, { waitUntil: 'networkidle2' });
        //await page.waitForNavigation()
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
        return res;
    } catch (error) {
        console.log(error);
    } finally {
        await browser.close();
    }
}

const fetchProductMercadona = async (url) => {
    const browser = await puppeteer.launch({headless: false});
    try {
        const page = await browser.newPage();
        await page.setViewport({
            width: 1200,
            height: 800,
            deviceScaleFactor: 1,
          });
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(500)
        //const title = await page.waitForSelector('h1.title2-r');
        const price = await page.$('p.product-price__unit-price.large-b');
        if (price) {
            console.log('ha entrado')
            const res = await page.evaluate(() => {

                const data = {
                    name: document.querySelector('h1.title2-r').innerText,
                    price: document.querySelector('p.product-price__unit-price.large-b').innnerText,
                    unitPrice: document.querySelector('div.product-format.product-format__size > span:nth-child(3)').innerText,
            }
            return data;
        })
            //console.log(res)
            return res;
        } else {
            //console.log('No ha entrado')
            await page.type('div > input', '46001', {delay: 100});
            await page.click('div > form > button')
            await page.waitForTimeout(2000)
            const res = await page.evaluate(() => {
                const data = {
                    name: document.querySelector('h1.title2-r').innerText,
                    price: document.querySelector('p.product-price__unit-price').innerText,
                    unitPrice: document.querySelector('div.product-format.product-format__size > span:nth-child(3)').innerText,
                }
                return data;
            })
            console.log(res)
            //console.log(page.url())
            return res;
            //await page.waitForTimeout(50000)
        }


    } catch (error) {
        console.log(error);
    } finally {
        await browser.close();
    }
}


const searchProductsConsum = async (url) => {
    const browser = await puppeteer.launch({headless: false});
    try {
        const page = await browser.newPage();
        await page.setViewport({
            width: 1200,
            height: 800,
            deviceScaleFactor: 1,
          });
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(3000)
        const products = await page.$$eval('div.widget-prod', divs => {
            return divs.map(div => {
                return {
                    brand: div.querySelector('#grid-widget--brand') ? div.querySelector('#grid-widget--brand').innerText : null,
                    name: div.querySelector('#grid-widget--descr').innerText,
                    price: div.querySelector('#grid-widget--price').innerText,
                    offerPrice: div.querySelector('#grid-widget--offerprice') ? div.querySelector('#grid-widget--offerprice').innerText : null,
                    unitpPrice: div.querySelector('div.widget-prod__info-unitprice > p').innerText,
                    code: div.querySelector('#grid-widget--descr').href.split('/').pop(),
                }
            })
        });
        console.log(products)

       
        
    } catch (error) {
        console.log(error);
    } finally {
        await browser.close();
    }
    
}

//fetchProductConsum('https://tienda.consum.es/es/p/huevo-campero-m-decena/7359040')
//fetchProductMercadona('https://tienda.mercadona.es/product/4717')
searchProductsConsum('https://tienda.consum.es/es/s/leche?orderById=7&page=1')

//#root > div.blank-layout > div.blank-layout__content > div > div.private-product-detail__content > div.private-product-detail__right > div.product-format.product-format__size > span:nth-child(3)
//#header__main--searcher
//#grid-widget-15691 > div
//#grid-widget-5126 > div > div.d-flex.flex-column.flex-grow-1.w-100.widget-prod__body.ng-tns-c256-262 > div.widget-prod__info.u-pointer.ng-tns-c256-262 > div.widget-prod__info-unitprice.ng-tns-c256-262