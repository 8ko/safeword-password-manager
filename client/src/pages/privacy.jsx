import React from 'react';
import { useNavigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const privacy = "SafeWord Privacy Policy\nAt SafeWord, accessible at SafeWordph.net, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by SafeWord and how we use it.\n\nThis privacy policy explains how we handle personal data as defined by RA10173 otherwise known as the Data Privacy Act of 2012 that we collect both directly thru our website and the third-party site that we connect to that may collect personal data as well. This privacy policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in SafeWord. This policy is not applicable to any information collected offline or via channels other than this website.\n\nDefinition of Terms\n[Source: RA 10173 https://privacy.gov.ph/data-privacy-act/]\n\nPersonal information – refers to any information whether recorded in a material form or not, from which the identity of an individual is apparent or can be reasonably and directly ascertained by the entity holding the information, or when put together with other information would directly and certainly identify an individual.\n\nInformation we collect\nWhen browsing the website in general We use cookies and other tracking technology which collect certain kinds of information when you interact with our website. Cookies are pieces of information that a web site transfers to the computer you use and may be placed on its hard disk for record-keeping purposes. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the website. “First party” cookies set by SafeWord website can only be read by that site.\nUpon registration of your HEI, we will collect your institution’s profile data (based on CMO 62 s. 2016) and will be kept in our online database for data analytics purposes.\nIf you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.\nHow we use your information\nProvide, operate, and maintain our website\nImprove, personalize, and expand our website\nUnderstand and analyze how you use our website\nDevelop new products, services, features, and functionality\nCommunicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes\nSend you emails\nFind and prevent fraud\nSecurity of collected information\nTo ensure the confidentiality, integrity, and availablity of personal data that is collected; organizational, administrative, and technical processes and procedures are put in place to safeguard the collected information from loss, misuse, unauthorized access, disclosure, alteration or destruction.\n\nRights of the Data Subject\n[Source: RA 10173 https://privacy.gov.ph/data-privacy-act/]\n\nAs the Data Subject, you are afforded the following rights as written in RA 10173 otherwise known as the Data Privacy Act of 2012.\n\nThe right to be informed whether personal information pertaining to him or her shall be, are being or have been processed.\nThe right to be furnished with the information before the entry of his or her personal information into the processing system of the personal information controller.\nThe right to reasonable access to the data subjects information upon demand.\nThe right to dispute the inaccuracy or error in the personal information and have the personal information controller correct it immediately and accordingly, unless the request is vexatious or otherwise unreasonable.\nThe right to suspend, withdraw or order the blocking, removal or destruction of his or her personal information from the personal information controller’s filing system upon discovery and substantial proof that the personal information are incomplete, outdated, false, unlawfully obtained, used for unauthorized purposes or are no longer necessary for the purposes for which they were collected.\nThe right to be indemnified for any damages sustained due to such inaccurate, incomplete, outdated, false, unlawfully obtained or unauthorized use of personal information.\nThe right to data portability thru the ability to obtain from the personal information controller a copy of data undergoing processing in an electronic or structured format, which is commonly used and allows for further use by the data subject.\nThe right to lodge a complaint before the National Privacy Commission.\nPersonal Information of other individuals\nIf you provide personal information to the site regarding other individuals or data subjects, it is required that you inform the data subject about the Privacy Policy of the site and obtain any legally-required consent for the collection, use, disclosure, and transfer of the personal information about the data subject in accordance with the Privacy Policy and RA10173.\n\nPersonal Information of Minors\nThe services on this site are generally intended for persons 18 years of age and older. In the event that information to be collected by or contributed to SafeWord is that of a minor, prior consent from the parent or legal guardian should be obtained in compliance with RA10173.";

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="d-flex flex-column align-self-center align-items-center">
                <Box sx={{my:2}}>
                    <Typography variant="h4">
                        Privacy Policy
                    </Typography>
                </Box>
                <TextareaAutosize
                    maxRows={25}
                    style={{ width: '95%' }}
                    defaultValue={privacy}
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

export default PrivacyPolicy;