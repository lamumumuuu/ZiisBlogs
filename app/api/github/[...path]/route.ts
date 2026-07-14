// app/api/github/[...path]/route.ts
// Catch-all 路由，代理所有 GitHub API 请求
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = request.nextUrl.pathname.replace('/api/github', '');

    const githubUrl = `https://api.github.com${path}?${searchParams.toString()}`;

    const response = await fetch(githubUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': request.headers.get('authorization') || '',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('GitHub API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy GitHub API' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname.replace('/api/github', '');
    const body = await request.json();

    const githubUrl = `https://api.github.com${path}`;
    const response = await fetch(githubUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': request.headers.get('authorization') || '',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('GitHub API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy GitHub API' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname.replace('/api/github', '');
    const body = await request.json();

    const githubUrl = `https://api.github.com${path}`;
    const response = await fetch(githubUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': request.headers.get('authorization') || '',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('GitHub API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy GitHub API' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname.replace('/api/github', '');

    const githubUrl = `https://api.github.com${path}`;
    const response = await fetch(githubUrl, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': request.headers.get('authorization') || '',
      },
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('GitHub API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy GitHub API' },
      { status: 500 }
    );
  }
}
