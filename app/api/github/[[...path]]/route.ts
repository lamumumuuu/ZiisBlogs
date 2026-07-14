import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getApiPath(request: NextRequest): string {
  const path = request.nextUrl.pathname.replace('/api/github', '');
  return path || '';
}

export async function GET(request: NextRequest) {
  try {
    const apiPath = getApiPath(request);
    const { searchParams } = new URL(request.url);

    if (!apiPath) {
      return NextResponse.json(
        { error: 'Invalid request: missing API path' },
        { status: 400 }
      );
    }

    const githubUrl = `https://api.github.com${apiPath}?${searchParams.toString()}`;
    console.log('[GitHub Proxy] GET:', githubUrl);

    const response = await fetch(githubUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': request.headers.get('authorization') || '',
        'User-Agent': 'Gitalk',
      },
    });

    const data = await response.json();
    console.log('[GitHub Proxy] GET status:', response.status);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[GitHub Proxy] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy GitHub API', message: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const apiPath = getApiPath(request);
    const body = await request.text();
    const contentType = request.headers.get('content-type') || '';

    if (!apiPath) {
      const githubUrl = 'https://github.com/login/oauth/access_token';
      console.log('[OAuth Proxy] POST:', githubUrl);
      console.log('[OAuth Proxy] body length:', body.length);

      const githubRes = await fetch(githubUrl, {
        method: 'POST',
        headers: {
          'Content-Type': contentType || 'application/json',
          'Accept': 'application/json',
        },
        body: body,
      });

      const data = await githubRes.json();
      console.log('[OAuth Proxy] response status:', githubRes.status);
      console.log('[OAuth Proxy] response data:', data);
      return NextResponse.json(data);
    }

    const githubUrl = `https://api.github.com${apiPath}`;
    console.log('[GitHub Proxy] POST:', githubUrl);

    const response = await fetch(githubUrl, {
      method: 'POST',
      headers: {
        'Content-Type': contentType || 'application/json',
        'Accept': 'application/json',
        'Authorization': request.headers.get('authorization') || '',
        'User-Agent': 'Gitalk',
      },
      body: body,
    });

    const data = await response.json();
    console.log('[GitHub Proxy] POST status:', response.status);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[GitHub Proxy] POST error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy GitHub API', message: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const apiPath = getApiPath(request);
    const body = await request.text();
    const contentType = request.headers.get('content-type') || '';

    if (!apiPath) {
      return NextResponse.json(
        { error: 'Invalid request: missing API path' },
        { status: 400 }
      );
    }

    const githubUrl = `https://api.github.com${apiPath}`;
    console.log('[GitHub Proxy] PATCH:', githubUrl);

    const response = await fetch(githubUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': contentType || 'application/json',
        'Accept': 'application/json',
        'Authorization': request.headers.get('authorization') || '',
        'User-Agent': 'Gitalk',
      },
      body: body,
    });

    const data = await response.json();
    console.log('[GitHub Proxy] PATCH status:', response.status);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[GitHub Proxy] PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy GitHub API', message: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const apiPath = getApiPath(request);

    if (!apiPath) {
      return NextResponse.json(
        { error: 'Invalid request: missing API path' },
        { status: 400 }
      );
    }

    const githubUrl = `https://api.github.com${apiPath}`;
    console.log('[GitHub Proxy] DELETE:', githubUrl);

    const response = await fetch(githubUrl, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': request.headers.get('authorization') || '',
        'User-Agent': 'Gitalk',
      },
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    console.log('[GitHub Proxy] DELETE status:', response.status);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[GitHub Proxy] DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy GitHub API', message: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const apiPath = getApiPath(request);
    const body = await request.text();
    const contentType = request.headers.get('content-type') || '';

    if (!apiPath) {
      return NextResponse.json(
        { error: 'Invalid request: missing API path' },
        { status: 400 }
      );
    }

    const githubUrl = `https://api.github.com${apiPath}`;
    console.log('[GitHub Proxy] PUT:', githubUrl);

    const response = await fetch(githubUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType || 'application/json',
        'Accept': 'application/json',
        'Authorization': request.headers.get('authorization') || '',
        'User-Agent': 'Gitalk',
      },
      body: body,
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    console.log('[GitHub Proxy] PUT status:', response.status);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[GitHub Proxy] PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy GitHub API', message: String(error) },
      { status: 500 }
    );
  }
}