import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const terms = "These Terms & Conditions govern your use of SafeWord and provide information about the SafeWord Service, outlined below. When you create a SafeWord account or use SafeWord, you agree to these terms.\n\nTerms of Use\nIn visiting the SafeWord app, the user agrees not to use it/any of its contents for any unlawful activity, or use it in any way that would violate any of the stated terms and conditions.\n\nIntellectual Property Policy\nAll materials contained in the SafeWord app, including but not limited to the app design, news articles, directories, photographic images, and the SafeWord logo are protected by copyright laws.\n\nDisclaimer Regarding Accuracy of Information and Usage of Data\nVisitors and users of the SafeWord app are advised that information contained within the SafeWord app is assumed to be accurate. However, errors can occur even with computer-generated information. SafeWord makes no representation regarding the completeness, accuracy, or timeliness of such information and data, or that such information and data will be error-free. Visitors are encouraged to review the official version of all documents on which they plan to rely on.\n\nThe contents of this SafeWord app are provided for information purposes only. SafeWord does not accept any liability to any person for the direct, indirect, incidental, special, or consequential damages that result from the use or misuse of any information provided in this SafeWord app. The user shall have sole responsibility for assessing the relevance and accuracy of the SafeWord app’s contents.\n\nIf the information on SafeWord’s official printed documents differs from the information contained on the SafeWord app, the information on SafeWord’s official printed documents will take precedence.\n\nThe information posted on the SafeWord app may be quoted or reproduced in whole or in part provided that SafeWord is duly informed/credited. Users are restricted from reselling, redistributing, or creating derivative works for commercial purposes without the expressed or written consent of SafeWord.\n\nAlthough the SafeWord IT Team tries to ensure broken links do not exist, links to other Internet apps may have changed. If you encounter broken links, please report immediately to the app administrator for proper action.";

const TermsAndConditions = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location?.state?.email || '';
    const pwd = location?.state?.pwd || '';

    return (
        <Box sx={{ textAlign: 'center', overflowY: 'hidden' }}>
            <Typography paragraph variant="h5" sx={{ mt: 1 }} style={{ marginLeft: -25 }}>
                TERMS AND CONDITIONS
            </Typography>
            <Box sx={{ mt: 2, width: '90%', height: 350, overflow: 'auto', p: 1 }}>
                <Typography paragraph
                    variant="overline"
                    sx={{
                        whiteSpace: 'pre-line',
                        textAlign: 'justify',
                        lineHeight: '16px'
                    }}>
                    {terms}
                </Typography>
            </Box>
            <Box sx={{ mt: 2 }} style={{ marginLeft: -25 }}>
                <Button variant="outlined" onClick={() => navigate('/register', { state: { email, pwd }, replace:true})}>
                    Back
                </Button>
            </Box>
        </Box>
    );
};

export default TermsAndConditions;