import { createRealmContext } from '@realm/react';

import History from './History';
import RecmdInfoDb from './RecmdInfoDb';
import Follow from './Follow';

const Context = createRealmContext({
  schema: [History, RecmdInfoDb, Follow],
})
export default Context;

