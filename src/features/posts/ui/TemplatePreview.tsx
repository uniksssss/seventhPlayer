import { publicAssetUrl } from '../../../shared/lib/images';
import { ReferenceImage, ComingSoonPreview } from './TemplatePreview.styles';
import type { PostTemplateId } from '../model/templates';

export function TemplatePreview({ templateId }: { templateId: PostTemplateId }) {
  if (templateId === 'match-day')
    return <ReferenceImage src={publicAssetUrl('/матч день.png')} alt="" />;
  if (templateId === 'birthday')
    return <ReferenceImage src={publicAssetUrl('/день рождения.png')} alt="" />;
  if (templateId === 'match-score')
    return <ReferenceImage src={publicAssetUrl('/итог матча.png')} alt="" />;
  if (templateId === 'match-stats')
    return <ReferenceImage src={publicAssetUrl('/статистика.png')} alt="" />;
  return <ComingSoonPreview>СКОРО БУДЕТ</ComingSoonPreview>;
}
