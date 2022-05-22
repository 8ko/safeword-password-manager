import React from 'react';
import { useNavigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const terms = "Welcome to SafeWord!\nThese Terms & Conditions govern your use of SafeWord and provide information about the SafeWord Service, outlined below. When you create a SafeWord account or use SafeWord, you agree to these terms.\n\nTerms of Use\nIn visiting the SafeWord website, the user agrees not to use it/any of its contents for any unlawful activity, or use it in any way that would violate any of the stated terms and conditions.\n\nIntellectual Property Policy\nAll materials contained in the SafeWord website, including but not limited to the site design, news articles, directories, photographic images, and the SafeWord logo are protected by copyright laws.\n\nDisclaimer Regarding Accuracy of Information and Usage of Data\nVisitors and users of the SafeWord website are advised that information contained within the SafeWord website is assumed to be accurate. However, errors can occur even with computer-generated information. SafeWord makes no representation regarding the completeness, accuracy, or timeliness of such information and data, or that such information and data will be error-free. Visitors are encouraged to review the official version of all documents on which they plan to rely on.\n\nThe contents of this SafeWord website are provided for information purposes only. SafeWord does not accept any liability to any person for the direct, indirect, incidental, special, or consequential damages that result from the use or misuse of any information provided in this SafeWord website. The user shall have sole responsibility for assessing the relevance and accuracy of the SafeWord website’s contents.\n\nIf the information on SafeWord’s official printed documents differs from the information contained on the SafeWord website, the information on SafeWord’s official printed documents will take precedence.\n\nThe information posted on the SafeWord website may be quoted or reproduced in whole or in part provided that SafeWord is duly informed/credited. Users are restricted from reselling, redistributing, or creating derivative works for commercial purposes without the expressed or written consent of SafeWord.\n\nAlthough the SafeWord IT Team tries to ensure broken links do not exist, links to other Internet sites may have changed. If you encounter broken links, please report immediately to the website administrator for proper action.";

const TermsAndConditions = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="d-flex flex-column align-self-center align-items-center">
                <Box sx={{my:2}}>
                    <Typography variant="h4">
                        Terms and Conditions
                    </Typography>
                </Box>
                <TextareaAutosize
                    maxRows={25}
                    style={{ width: '95%' }}
                    defaultValue={terms}
                />
                <Box sx={{my:2}}>
                    <Button variant="contained" onClick={() => navigate(-1)}>
                        Go Back
                    </Button>
                </Box>
            </div>

        </>
    );
};

export default TermsAndConditions;