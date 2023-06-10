import { createRealmContext } from '@realm/react';

import History from './HistoryDb';
import Follow from './FollowDb';
import Download from './SectionDb';
import EpisodeDb from './EpisodeDb'
import ListItemInfoDb from './ListItemInfoDb';

const schema = [History, Follow, Download, EpisodeDb, ListItemInfoDb]
const Context = createRealmContext({ schema })
export default Context;
export { schema }

