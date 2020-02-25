import express, { Request, Response } from 'express';
import fetch from 'node-fetch';

const server = express();

server.get('/api/oauth', async function(req: Request, res: Response) {
  if (typeof req.query.code) {
    try {
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: '1921cbd6e62842123d88',
          client_secret: 'ef02d32e7d6ba160868b3836924f77b21e69054c',
          code: req.query.code,
        }),
      });

      const body: {
        token_type: string;
        access_token: string;
      } = await response.json();

      const { token_type, access_token } = body;

      res.writeHead(302, {
        Location: `http://localhost:3000/login?token_type=${token_type}&access_token=${access_token}`,
      });

      res.send();
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

server.listen(3001, function() {
  console.log('Server listen on 3001');
});
