import style from "@/app/(default)/login/login.module.scss";
import { LoginForm } from "@/app/(default)/login/LoginForm";
import { Box, Container, Grid, GridCol } from "@/dsfr";
import { DsfrPage } from "@/dsfr/layout/DsfrPage";

import { DomainPageHOP } from "../DomainPage";

const TenantLoginPage = DomainPageHOP({ withSettings: true })(props => {
  return (
    <DsfrPage>
      <Container ptmd="14v" mbmd="14v" fluid>
        <Grid haveGutters align="center">
          <GridCol md={8} lg={6}>
            <Container pxmd="0" py="10v" mymd="14v" className={style.login}>
              <Grid haveGutters align="center">
                <GridCol md={9} lg={8}>
                  <h1>Connexion espace : {props._data.settings?.name}</h1>
                  <Box>
                    <LoginForm loginWithEmail />
                  </Box>
                </GridCol>
              </Grid>
            </Container>
          </GridCol>
        </Grid>
      </Container>
    </DsfrPage>
  );
});

export default TenantLoginPage;
