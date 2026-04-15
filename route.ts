import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');

// 确保数据目录存在
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(FEEDBACK_FILE)) {
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify({ feedbacks: [], stats: { total: 0, positive: 0, negative: 0 } }, null, 2));
  }
}

// 获取所有反馈
export async function GET() {
  ensureDataDir();
  
  try {
    const data = JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf-8'));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ feedbacks: [], stats: { total: 0, positive: 0, negative: 0 } });
  }
}

// 提交反馈
export async function POST(request: NextRequest) {
  ensureDataDir();
  
  try {
    const body = await request.json();
    const { rating, message, zodiac, mbti, question, response } = body;
    
    // 验证数据
    if (!rating || !['positive', 'negative', 'neutral'].includes(rating)) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
    }
    
    // 创建反馈记录
    const feedback = {
      id: Date.now().toString(),
      rating,
      message: message?.substring(0, 500) || '', // 限制长度
      zodiac: zodiac || 'unknown',
      mbti: mbti || 'unknown',
      question: question?.substring(0, 200) || '',
      response: response?.substring(0, 500) || '',
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || 'unknown',
    };
    
    // 读取现有数据
    const data = JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf-8'));
    
    // 添加新反馈
    data.feedbacks.unshift(feedback); // 最新反馈在前
    data.stats.total++;
    if (rating === 'positive') data.stats.positive++;
    if (rating === 'negative') data.stats.negative++;
    
    // 限制存储数量（保留最近1000条）
    if (data.feedbacks.length > 1000) {
      data.feedbacks = data.feedbacks.slice(0, 1000);
    }
    
    // 保存数据
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Thank you for your feedback!',
      stats: data.stats 
    });
  } catch (error) {
    console.error('Feedback Error:', error);
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
  }
}
