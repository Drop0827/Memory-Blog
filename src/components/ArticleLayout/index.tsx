import Dynamic from './components/Dynamic';
import Swiper from '../Swiper';
import Classics from './Classics';
import Waterfall from './Waterfall';
import Card from './Card';
import Pagination from '../Pagination';

import { getArticlePagingAPI } from '@/api/article';
import { getWebConfigDataAPI } from '@/api/config';
import { Theme } from '@/types/app/config';
import { Article } from '@/types/app/article';
import { Swiper as SwiperType } from '@/types/app/swiper';
import { getSwiperListAPI } from '@/api/swiper';

export default async ({ page }: { page: number }) => {
  const { data: swiper } = (await getSwiperListAPI()) || { data: [] as SwiperType[] };
  const themeResponse = await getWebConfigDataAPI<{ value: Theme }>('theme');
  const theme = themeResponse?.data?.value || ({} as Theme);
  const sidebar = theme?.right_sidebar || [];

  // 如果是瀑布流布局就显示28条数据，否则显示8条
  const { data } = (await getArticlePagingAPI({ pagination: { page, size: theme.is_article_layout === 'waterfall' ? 28 : 8 } })) || { data: {} as Paginate<Article[]> };
  data.result = data?.result?.filter((item) => item.config.status !== 'no_home') || [];

  return (
    <div className={`w-full md:w-[90%] ${sidebar?.length ? 'lg:w-[68%] xl:w-[73%]' : 'w-full'} mx-auto transition-width`}>
      {!!swiper?.length && <Swiper data={swiper} />}
      <Dynamic className="my-2" />

      {theme.is_article_layout === 'classics' && <Classics data={data} />}
      {theme.is_article_layout === 'card' && <Card data={data} />}
      {theme.is_article_layout === 'waterfall' && <Waterfall data={data} />}

      {data.total && <Pagination total={data?.pages} page={page} className="flex justify-center mt-5" />}
    </div>
  );
};
