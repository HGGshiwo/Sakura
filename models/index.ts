import { createRealmContext } from '@realm/react';

import History from './HistoryDb';
import Follow from './FollowDb';
import Download from './SectionDb';
import EpisodeDb from './EpisodeDb'
import ListItemInfoDb from './ListItemInfoDb';

const Context = createRealmContext({
  schema: [History, Follow, Download, EpisodeDb, ListItemInfoDb],
})
export default Context;

