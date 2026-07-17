import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),

                breathePulse: resolve(__dirname, 'breathepulse/index.html'),
                breathePulseSupport: resolve(__dirname, 'breathpulsesupport/index.html'),
                breathePulsePrivacy: resolve(__dirname, 'breathpulseprivacypolicy/index.html'),
                breathePulseTerms: resolve(__dirname, 'breathpulseterms/index.html'),

                hourd: resolve(__dirname, 'hourd/index.html'),
                hourdSupport: resolve(__dirname, 'hourdsupport/index.html'),
                hourdPrivacy: resolve(__dirname, 'hourdprivacypolicy/index.html'),
                hourdTerms: resolve(__dirname, 'hourdterms/index.html'),

                costime: resolve(__dirname, 'timecostify/index.html'),
                costimeSupport: resolve(__dirname, 'timecostifysupport/index.html'),
                costimePrivacy: resolve(__dirname, 'timecostifyprivacypolicy/index.html'),
                costimePrivacyAppstore: resolve(__dirname, 'costimeprivacypolicy/index.html'),
                costimePrivacyFooter: resolve(__dirname, 'timecostyprivacypolicy/index.html'),
                costimeTerms: resolve(__dirname, 'costimeterms/index.html'),
                priceInWorkHoursCalculator: resolve(__dirname, 'price-in-work-hours-calculator/index.html'),

                pottyDog: resolve(__dirname, 'pottydog/index.html'),
                pottyDogSupport: resolve(__dirname, 'pottydogsupport/index.html'),
                pottyDogPrivacy: resolve(__dirname, 'pottydogprivacypolicy/index.html'),
                pottyDogTerms: resolve(__dirname, 'pottydogterms/index.html'),

                coupleStatus: resolve(__dirname, 'couplestatus/index.html'),
                coupleStatusSupport: resolve(__dirname, 'couplestatussupport/index.html'),
                coupleStatusPrivacy: resolve(__dirname, 'couplestatusprivacypolicy/index.html'),
                coupleStatusTerms: resolve(__dirname, 'couplestatusterms/index.html'),
                couplesMoodTrackerWidget: resolve(__dirname, 'couples-mood-tracker-widget/index.html'),
                longDistanceCoupleApp: resolve(__dirname, 'long-distance-couple-app/index.html'),
                partnerAvailabilityApp: resolve(__dirname, 'partner-availability-app/index.html'),
            },
        },
    },
});
