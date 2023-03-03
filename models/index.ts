import { createRealmContext } from '@realm/react';

import History from './History';
import Anime from './Anime';
import Follow from './Follow';

const Context = createRealmContext({
  schema: [History, Anime, Follow],
})
export default Context;

