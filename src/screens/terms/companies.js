import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { Container, Flex, Typography } from "../../atom-components";
import {
  CheckBox,
  Header,
  OutlineButton,
  PrimaryButton,
} from "../../components";
import { COLORS } from "../../globals";
import { sizer } from "../../helpers";

const CompaniesTerms = () => {
  const [checkbox, setCheckBox] = useState(false);
  return (
    <ScrollView>
      <Container pT={7}>
        <Header back />
        <Typography text="Companies" color={COLORS.primary} semiBold mT={29} />
        <Typography text="Terms and Conditions" size={24} bold mT={16} />
        <Typography
          text="Your Agreement"
          bold
          mT={25}
          color={COLORS.darkblue}
        />

        <Typography
          color={COLORS.greyV2}
          LineHeight={21}
          size={14}
          mT={6}
          textAlign="justify"
          text={`Last Revised: December 16, 2013 Welcome to www.lorem-ipsum.info. This site is provided as a service to our visitors and may be used for informational purposes only. Because the Terms and Conditions contain legal obligations, please read them carefully. 1. YOUR AGREEMENT By using this Site, you agree to be bound by, and to comply with, these Terms and Conditions. If you do not agree to these Terms and Conditions, please do not use this site. PLEASE NOTE: We reserve the right, at our sole discretion, to change, modify or otherwise alter these Terms and Conditions at any time. Unless otherwise indicated, amendments will become effective immediately. Please review these Terms and Conditions periodically. Your continued use of the Site following the posting of changes and/or modifications will constitute your acceptance of the revised Terms and Conditions and the reasonableness of these standards for notice of changes. For your information, this page was last updated as of the date at the top of these terms and conditions. 2. PRIVACY Please review our Privacy Policy, which also governs your visit to this Site, to understand our practices. 3. LINKED SITES This Site may contain links to other independent third-party Web sites ("Linked Sites”). These Linked Sites are provided solely as a convenience to our visitors. Such Linked Sites are not under our control, and we are not responsible for and does not endorse the content of such Linked Sites, including any information or materials contained on such Linked Sites. You will need to make your own independent judgment regarding your interaction with these Linked Sites. 4. FORWARD LOOKING STATEMENTS All materials reproduced on this site speak as of the original date of publication or filing. The fact that a document is available on this site does not mean that the information contained in such document has not been modified or superseded by events or by a subsequent document or filing. We have no duty or policy to update any information or statements contained on this site and, therefore, such information or statements should not be relied upon as being current as of the date you access this site. 5. DISCLAIMER OF WARRANTIES AND LIMITATION OF LIABILITY A. THIS SITE MAY CONTAIN INACCURACIES AND TYPOGRAPHICAL ERRORS. WE DOES NOT WARRANT THE ACCURACY OR COMPLETENESS OF THE MATERIALS OR THE RELIABILITY OF ANY ADVICE, OPINION, STATEMENT OR OTHER INFORMATION DISPLAYED OR DISTRIBUTED THROUGH THE SITE. YOU EXPRESSLY UNDERSTAND AND AGREE THAT: (i) YOUR USE OF THE SITE, INCLUDING ANY RELIANCE ON ANY SUCH OPINION, ADVICE, STATEMENT, MEMORANDUM, OR INFORMATION CONTAINED HEREIN, SHALL BE AT YOUR SOLE RISK; (ii) THE SITE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS; (iii) EXCEPT AS EXPRESSLY PROVIDED HEREIN WE DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, WORKMANLIKE EFFORT, TITLE AND NON-INFRINGEMENT; (iv) WE MAKE NO WARRANTY WITH RESPECT TO THE RESULTS THAT MAY BE OBTAINED FROM THIS SITE, THE PRODUCTS OR SERVICES ADVERTISED OR OFFERED OR MERCHANTS INVOLVED; (v) ANY MATERIAL DOWNLOADED OR OTHERWISE OBTAINED THROUGH THE USE OF THE SITE IS DONE AT YOUR OWN DISCRETION AND RISK; and (vi) YOU WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR COMPUTER SYSTEM OR FOR ANY LOSS OF DATA THAT RESULTS FROM THE DOWNLOAD OF ANY SUCH MATERIAL. B. YOU UNDERSTAND AND AGREE THAT UNDER NO CIRCUMSTANCES, INCLUDING, BUT NOT LIMITED TO, NEGLIGENCE, SHALL WE BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE OR CONSEQUENTIAL DAMAGES THAT RESULT FROM THE USE OF, OR THE INABILITY TO USE, ANY OF OUR SITES OR MATERIALS OR FUNCTIONS ON ANY SUCH SITE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. THE FOREGOING LIMITATIONS SHALL APPLY NOTWITHSTANDING ANY FAILURE OF ESSENTIAL PURPOSE OF ANY LIMITED REMEDY. 6. EXCLUSIONS AND LIMITATION..`}
        />

        <Flex gap={5}>
          <CheckBox isCheck={checkbox} setCheck={setCheckBox} />
          <Typography
            size={14}
            bold
            LineHeight={21}
            text="By ticking this box, you agree to the above terms 
and conditions."
          />
        </Flex>

        <Flex mt={23} gap={9} mb={40}>
          <PrimaryButton
            label="Accept"
            height={31}
            btnStyle={{ flex: 0.5, borderRadius: sizer.moderateScale(50) }}
          />
          <OutlineButton label="Decline" style={{ flex: 0.5, height: 31 }} />
        </Flex>
      </Container>
    </ScrollView>
  );
};

export default CompaniesTerms;

const styles = StyleSheet.create({});
