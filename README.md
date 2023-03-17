# DELTA-NEXTJS-CLIENT

### Setup

Start by cloning the repository

Then run the server

```sh
npm install
npm run dev
```

UI will connect to a delta-dm instance at `http://localhost:1314` by default. Set `NEXT_PUBLIC_API_URL` to override this. 

Go to `http://localhost:3005` in your browser of choice. Enjoy!

### Running in Production

Create a production-ready build by running 
```sh
npm install
npm run build
```

Then, you can serve the production build with
```sh
npm run start
```

Production build will be accessible at `http://localhost:3000`
