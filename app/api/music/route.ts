// =====================================================================
// 文件位置注释
// =====================================================================
// 主文件夹路径：c:\Users\admin\Desktop\新建文件夹\Ziis3.0\ZiisBlogs
// 当前文件路径：c:\Users\admin\Desktop\新建文件夹\Ziis3.0\ZiisBlogs\app\api\music\route.ts
// 文件类型：Next.js App Router API 路由
// 功能描述：音乐数据 API，代理请求网易云音乐接口。
//          根据传入的歌曲 ID 列表，获取歌曲详情、播放地址和歌词。
//          作为服务端代理，避免浏览器跨域问题。
// =====================================================================

import { NextRequest, NextResponse } from 'next/server';

// =====================================================================
// 网易云音乐 API 请求头
// =====================================================================
// 设置 User-Agent 和 Referer 伪装成浏览器请求
// 避免被网易云 API 拦截
// =====================================================================
const NET_EASE_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  Referer: 'https://music.163.com/',
};

// =====================================================================
// 歌曲结果类型定义
// =====================================================================
interface SongResult {
  id: string;
  name?: string;
  artist?: string;
  author?: string;
  cover?: string;
  pic?: string;
  url?: string;
  lrc?: string;
  error?: string;
}

// =====================================================================
// GET 请求处理函数
// =====================================================================
// 功能：
//   1. 接收 ids 查询参数（逗号分隔的歌曲 ID 列表）
//   2. 并发请求网易云音乐的歌曲详情和歌词接口
//   3. 整合数据后返回统一格式的 JSON
//
// 参数：
//   - request: NextRequest 对象，包含请求信息
//   - 查询参数 ids: 歌曲 ID 列表，用逗号分隔
//
// 返回值：
//   - JSON 数组，每个元素是一首歌曲的信息
//   - 失败的歌曲会包含 error 字段
//
// 设计思路：
//   - 使用 Promise.all 并发请求，提高响应速度
//   - 每首歌曲的详情和歌词也并发请求
//   - 设置 6 秒超时，避免长时间等待
//   - 歌词获取失败不影响主流程（容错处理）
//   - 播放地址使用网易云外链地址格式
// =====================================================================
export async function GET(request: NextRequest) {
  // 从查询参数中获取 ids
  const ids = request.nextUrl.searchParams.get('ids');
  if (!ids) {
    return NextResponse.json({ error: 'Missing ids parameter' }, { status: 400 });
  }

  // 分割 ID 列表，去除空白项
  const songIds = ids.split(',').map((id) => id.trim()).filter(Boolean);

  // ===================================================================
  // 并发获取所有歌曲的数据
  // ===================================================================
  const results: SongResult[] = await Promise.all(
    songIds.map(async (songId): Promise<SongResult> => {
      try {
        // ---------------------------------------------------------------
        // 并发请求：歌曲详情 + 歌词
        // ---------------------------------------------------------------
        // 使用 Promise.all 同时发起两个请求
        // 歌词请求失败不影响主流程（catch 返回 null）
        const [detailRes, lrcRes] = await Promise.all([
          fetch(
            `https://music.163.com/api/song/detail/?id=${songId}&ids=[${songId}]`,
            { headers: NET_EASE_HEADERS, signal: AbortSignal.timeout(6000) },
          ),
          fetch(
            `https://music.163.com/api/song/lyric?id=${songId}&lv=-1&kv=-1&tv=-1`,
            { headers: NET_EASE_HEADERS, signal: AbortSignal.timeout(6000) },
          ).catch(() => null),
        ]);

        // 解析歌曲详情
        const detail = await detailRes.json();
        const song = detail.songs?.[0];

        // 歌曲不存在
        if (!song) {
          return { id: songId, error: 'not_found' };
        }

        // ---------------------------------------------------------------
        // 解析歌词（容错处理）
        // ---------------------------------------------------------------
        let lrcText = '';
        if (lrcRes && lrcRes.ok) {
          try {
            const lrcData = await lrcRes.json();
            lrcText = lrcData.lrc?.lyric || '';
          } catch {
            // 歌词解析失败不影响主流程
          }
        }

        // 获取歌手名（取第一个歌手）
        const artistName = song.artists?.[0]?.name || '未知歌手';

        // ---------------------------------------------------------------
        // 返回格式化后的歌曲数据
        // ---------------------------------------------------------------
        return {
          id: songId,
          name: song.name,
          artist: artistName,
          author: artistName,
          cover: song.album?.picUrl || '',
          pic: song.album?.picUrl || '',
          // 网易云音乐外链播放地址
          url: `https://music.163.com/song/media/outer/url?id=${songId}.mp3`,
          lrc: lrcText,
        };
      } catch (error) {
        // 捕获所有异常，返回错误信息
        console.error(`[api/music] 获取歌曲 ${songId} 失败:`, error);
        return { id: songId, error: String(error) };
      }
    }),
  );

  // 返回 JSON 响应
  return NextResponse.json(results);
}
