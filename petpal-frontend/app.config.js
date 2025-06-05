import 'dotenv/config';

export default {
  expo: {
    name: 'PetPal',
    slug: 'petpal',
    extra: {
      API_URL: process.env.API_URL,
    },
  },
};