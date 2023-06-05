import { createRealmContext } from '@realm/react';

import History from './HistoryDb';
import RecmdInfoDb from './RecmdInfoDb';
import Follow from './FollowDb';
import Download from './DownloadDb';
import TaskDb from './TaskDb'

const Context = createRealmContext({
  schema: [History, RecmdInfoDb, Follow, Download, TaskDb],
})
export default Context;

