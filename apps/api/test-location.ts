const API_KEY =
  'dUNRtxGjQOMU5LY013xnLqm8OgCBHIPILmsRw1jF2BvrdJF0Ekv6geWX6YEBJiEQ8meOWjesqxI2d6qWVHwxThfpxoEpXC37YWbW';
const ENDPOINT =
  'http://apis.data.go.kr/1741000/StanReginCd/getStanReginCdList';

async function testApi() {
  try {
    console.log('Testing Public Data Portal API with fetch...');

    // Construct URL with raw key
    const url = `${ENDPOINT}?ServiceKey=${API_KEY}&type=json&pageNo=1&numOfRows=10`;
    console.log('Requesting URL:', url);

    const response = await fetch(url);
    console.log('Status:', response.status);

    const text = await response.text();
    console.log('Raw Response:', text.substring(0, 1000));

    try {
      const json = JSON.parse(text);
      console.log('Parsed JSON:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Response is not JSON.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testApi();
