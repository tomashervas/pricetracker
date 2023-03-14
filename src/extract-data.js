import puppeteer from 'puppeteer';

export const fetchProductConsum = async (url) => {
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

export const fetchProductMercadona = async (url) => {
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


export const searchProductsConsum = async (product) => {
    const url = `https://tienda.consum.es/es/s/${product}?orderById=7&page=1`
    const browser = await puppeteer.launch({headless: false});
    try {
        const page = await browser.newPage();
        await page.setViewport({
            width: 1200,
            height: 800,
            deviceScaleFactor: 1,
          });
        await page.goto(url, { waitUntil: 'networkidle2' });
        //await page.waitForTimeout(3000)
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
        return products;

    } catch (error) {
        console.log(error);
    } finally {
        await browser.close();
    }
    
}

export const searchProductsMercadona = async (product) => {
    const url = `https://tienda.mercadona.es/search-results?query=${product}`
    const browser = await puppeteer.launch({headless: false});
    try {
        const page = await browser.newPage();
        await page.setViewport({
            width: 1200,
            height: 800,
            deviceScaleFactor: 1,
          });
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.type('div > input[name="postalCode"]', (Math.floor(Math.random() * 26) + 46001).toString(), {delay: 100});
        await page.click('aria/Continuar')
        await new Promise(resolve => setTimeout(resolve, 250));
        const products = await page.evaluate( async () => {
            const productDivs = document.querySelectorAll('div[data-test=product-cell]')
            const result = [];
            const length = productDivs.length < 10 ? productDivs.length : 10;
            for (let i = 0; i < length; i++) {
                const product = {};
                product.name = productDivs[i].querySelector('h4').innerText;
                product.price = productDivs[i].querySelector('p[data-test=product-price]').innerText;
                // Hacer clic en el botón para abrir el modal
                await productDivs[i].querySelector('button[data-test=open-product-detail]').click();
                // Esperar a que el modal se abra completamente
                await new Promise(resolve => setTimeout(resolve, 100));

                const modal = document.querySelector('div[data-test=private-product-detail-info]');
                product.unitPrice = modal.querySelector('div.product-format').innerText
                product.code = window.location.href.split('/')[window.location.href.split('/').length - 2]
                result.push(product);

            }
            return result;
          });
          
          console.log(products)
          return products;

    } catch (error) {
        console.log(error);
    } finally {
        await browser.close();
    }
    
}

//fetchProductConsum('https://tienda.consum.es/es/p/huevo-campero-m-decena/7359040')
//fetchProductMercadona('https://tienda.mercadona.es/product/4717')
//searchProductsConsum('entrecot')
//searchProductsMercadona('pizza')
