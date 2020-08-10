'use strict';
const chromium = require('chrome-aws-lambda');
const puppeteer = chromium.puppeteer;

module.exports.index = async (event, context) => {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      defaultViewport:{width:1024,height:800},
      headless: true,
      executablePath: await chromium.executablePath,
      args: chromium.args,
    });

    const page = await browser.newPage();
 	 // const {minTxt}= event['queryStringParameters'].address;
 	   const { firstname }= event.queryStringParameters;
 	   const { lastname }= event.queryStringParameters;
 	   const { personnummer }= event.queryStringParameters;
	
	  let texten="Varför inför SEB QR-kod vid identifiering med mobilt BankID?\r\nInloggning med QR-kod är en ny säkerhetsfunktion i mobilt BankID. Genom att du läser av QR-koden på din datorskärm vet vi att din dator och mobiltelefon är på samma plats när du legitimerar dig eller skriver under i andra enheter än den där du har ditt mobila BankID. Till exempel när du använder ditt mobila BankID för att logga in på internetbanken.";
	   await page.setContent('<center><h1>Försäkringsbesked </h1><p> <table><tr><td><b> kundnamn:</b></td><td>'+firstname+' '
	   +lastname+'</td></tr><tr><td><b> personnummer:</b> '+personnummer+'</td></tr></table><p>'+texten);
	   const stream =await page.pdf( { format: 'A4',printBackgrund: true } );
	

	
  /*  await page.goto(event['queryStringParameters'].address, {
      waitUntil: ['domcontentloaded', 'networkidle0'],
    });

    const image = await page.screenshot({
      clip: { x: 0, y: 0, width: 1024, height: 800 },
      encoding: 'base64'
    });*/
	
	
	

    return {
      statusCode: 200,
      isBase64Encoded:true,
      headers: {
        'Content-Type': 'application/pdf',
      },
       body: stream.toString("base64")
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500
    };
  }
  finally{
    if(browser)
      await browser.close();
  }
};
