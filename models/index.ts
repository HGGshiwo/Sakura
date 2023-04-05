import { createRealmContext } from '@realm/react';

import History from './History';
import RecmdInfoDb from './RecmdInfoDb';
import Follow from './Follow';
import Download from './Download';

const Context = createRealmContext({
  schema: [History, RecmdInfoDb, Follow, Download],
})
export default Context;

