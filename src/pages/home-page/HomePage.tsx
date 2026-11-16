import {
  Page,
  Header,
  HeaderLogo,
  TemplatePicker,
  Title,
  TemplateGrid,
  TemplateLink,
  Card,
  CardFooter,
  TemplateName,
} from '../home-page/HomePage.styles';
import { postTemplates } from '../../features/posts/model/templates';
import { TemplatePreview } from '../../features/posts/ui/TemplatePreview';
import { publicAssetUrl } from '../../shared/lib/images';

export function HomePage() {
  return (
    <Page>
      <Header>
        <HeaderLogo viewBox="20 182 1080 265" role="img" aria-label="Фан-сектор «Седьмой игрок»">
          <image href={publicAssetUrl('/лого строка.png')} width="1177" height="600" />
        </HeaderLogo>
      </Header>
      <main>
        <TemplatePicker>
          <Title>Выберите тип поста</Title>
          <TemplateGrid>
            {postTemplates.map((template) =>
              template.ready ? (
                <TemplateLink key={template.id} href={`#/${template.id}`}>
                  <Card>
                    <TemplatePreview templateId={template.id} />
                    <CardFooter>
                      <TemplateName>{template.title}</TemplateName>
                      <span aria-hidden="true">→</span>
                    </CardFooter>
                  </Card>
                </TemplateLink>
              ) : (
                <Card key={template.id}>
                  <TemplatePreview templateId={template.id} />
                  <CardFooter>
                    <TemplateName>{template.title}</TemplateName>
                  </CardFooter>
                </Card>
              ),
            )}
          </TemplateGrid>
        </TemplatePicker>
      </main>
    </Page>
  );
}
