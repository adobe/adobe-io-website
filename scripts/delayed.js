// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-helix.js';
import {
  decorateHelix2Embeds,
  decorateEmbeds,
} from './lib-adobeio.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
await decorateHelix2Embeds();
await decorateEmbeds();
