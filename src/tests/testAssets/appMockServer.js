import { rest } from 'msw';
import { setupServer } from 'msw/node';

const usTopNewsXML = `
    <channel>
    <title>US Top News</title>
    </channel>
        `;

const usBusinessXML = `
    <channel>
        <title>US Business News</title>
    </channel>
        `;

const usSportsXML = `
    <channel>
        <title>US Sports News</title>
    </channel>
        `;

const gbTopNewsXML = `
    <channel>
      <title>GB Top News</title>
    </channel>
        `;

const gbBusinessXML = `
    <channel>
      <title>GB Business News</title>
    </channel>
        `;

const resWithSupportedCountry = {
  country_code: 'US',
  country_name: 'United States',
  IPv4: '135.250.43.126'
};

const server = setupServer(
  ...[
    rest.get('/api', (req, res, ctx) => {
      const hl = req.url.searchParams.get('hl');
      const gl = req.url.searchParams.get('gl');
      const ceid = req.url.searchParams.get('ceid');
      if (hl === 'en-US' && gl === 'US' && ceid === 'US:en')
        return res(ctx.xml(usTopNewsXML));
      if (hl === 'en-GB' && gl === 'GB' && ceid === 'GB:en')
        return res(ctx.xml(gbTopNewsXML));
    }),
    rest.get('/api/topics/business', (req, res, ctx) => {
      const hl = req.url.searchParams.get('hl');
      const gl = req.url.searchParams.get('gl');
      const ceid = req.url.searchParams.get('ceid');
      if (hl === 'en-US' && gl === 'US' && ceid === 'US:en')
        return res(ctx.xml(usBusinessXML));
      if (hl === 'en-GB' && gl === 'GB' && ceid === 'GB:en')
        return res(ctx.xml(gbBusinessXML));
    }),
    rest.get('/api/topics/sports', (req, res, ctx) => {
      const hl = req.url.searchParams.get('hl');
      const gl = req.url.searchParams.get('gl');
      const ceid = req.url.searchParams.get('ceid');
      if (hl === 'en-US' && gl === 'US' && ceid === 'US:en')
        return res(ctx.xml(usSportsXML));
    }),
    rest.get(`/geo/${resWithSupportedCountry.IPv4}`, (req, res, ctx) => {
      return res(ctx.json(resWithSupportedCountry));
    })
  ]
);

export default server;
