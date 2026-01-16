import React, { useState, useEffect, useMemo } from 'react';
import { Volume2, BookOpen, Brain, ChevronRight, ChevronLeft, X, RotateCcw, CheckCircle, XCircle, Search, Home, Info, Filter, MessageCircle, Play, Pause, Save, List, Star, Shuffle } from 'lucide-react';

// --- データ定義 ---

// 文字（コーカイ）データベース
const CHAR_DB = {
  'ก': { type: '子音', class: '中類', name: 'コー・カイ', meaning: '鶏', sound: 'k' },
  'ข': { type: '子音', class: '高類', name: 'コー・カイ', meaning: '卵', sound: 'kh' },
  'ฃ': { type: '子音', class: '高類', name: 'コー・クアット', meaning: '瓶(廃字)', sound: 'kh' },
  'ค': { type: '子音', class: '低類', name: 'コー・クワイ', meaning: '水牛', sound: 'kh' },
  'ง': { type: '子音', class: '低類', name: 'ンゴー・ングー', meaning: '蛇', sound: 'ng' },
  'จ': { type: '子音', class: '中類', name: 'チョー・チャーン', meaning: '皿', sound: 'ch' },
  'ช': { type: '子音', class: '低類', name: 'チョー・チャーン', meaning: '象', sound: 'ch' },
  'ด': { type: '子音', class: '中類', name: 'ドー・デック', meaning: '子供', sound: 'd' },
  'ต': { type: '子音', class: '中類', name: 'トー・タオ', meaning: '亀', sound: 't' },
  'ท': { type: '子音', class: '低類', name: 'トー・タハーン', meaning: '兵隊', sound: 'th' },
  'น': { type: '子音', class: '低類', name: 'ノー・ヌー', meaning: 'ネズミ', sound: 'n' },
  'บ': { type: '子音', class: '中類', name: 'ボー・バイマイ', meaning: '葉', sound: 'b' },
  'ป': { type: '子音', class: '中類', name: 'ポー・プラー', meaning: '魚', sound: 'p' },
  'ผ': { type: '子音', class: '高類', name: 'ポー・プン', meaning: '蜂', sound: 'ph' },
  'ฝ': { type: '子音', class: '高類', name: 'フォー・ファー', meaning: '蓋', sound: 'f' },
  'พ': { type: '子音', class: '低類', name: 'ポー・パーン', meaning: '皿', sound: 'ph' },
  'ฟ': { type: '子音', class: '低類', name: 'フォー・ファン', meaning: '歯', sound: 'f' },
  'ม': { type: '子音', class: '低類', name: 'モー・マー', meaning: '馬', sound: 'm' },
  'ย': { type: '子音', class: '低類', name: 'ヨー・ヤック', meaning: '鬼', sound: 'y' },
  'ร': { type: '子音', class: '低類', name: 'ロー・ルア', meaning: '船', sound: 'r' },
  'ล': { type: '子音', class: '低類', name: 'ロー・リン', meaning: '猿', sound: 'l' },
  'ว': { type: '子音', class: '低類', name: 'ウォー・ウェーン', meaning: '指輪', sound: 'w' },
  'ส': { type: '子音', class: '高類', name: 'ソー・スア', meaning: '虎', sound: 's' },
  'ห': { type: '子音', class: '高類', name: 'ホー・ヒープ', meaning: '箱', sound: 'h' },
  'อ': { type: '子音', class: '中類', name: 'オー・アーン', meaning: '水盤', sound: 'o' },
  'ฮ': { type: '子音', class: '低類', name: 'ホー・ノックフーク', meaning: 'フクロウ', sound: 'h' },
  'ณ': { type: '子音', class: '低類', name: 'ノー・ネーン', meaning: '小坊主', sound: 'n' },
  'ญ': { type: '子音', class: '低類', name: 'ヨー・イン', meaning: '女性', sound: 'y' },
  'ะ':  { type: '母音', name: 'サーラ・ア', sound: 'a (短)' },
  'ั':  { type: '母音', name: 'マイ・ハン・アカバ', sound: 'a (短)' },
  'า':  { type: '母音', name: 'サーラ・アー', sound: 'aa (長)' },
  'ิ':  { type: '母音', name: 'サーラ・イ', sound: 'i (短)' },
  'ี':  { type: '母音', name: 'サーラ・イー', sound: 'ii (長)' },
  'ึ':  { type: '母音', name: 'サーラ・ウ（口を横）', sound: 'ue (短)' },
  'ื':  { type: '母音', name: 'サーラ・ウー（口を横）', sound: 'uee (長)' },
  'ุ':  { type: '母音', name: 'サーラ・ウ', sound: 'u (短)' },
  'ู':  { type: '母音', name: 'サーラ・ウー', sound: 'uu (長)' },
  'เ':  { type: '母音', name: 'サーラ・エー', sound: 'ee (長)' },
  'แ':  { type: '母音', name: 'サーラ・エ―', sound: 'ae (長)' },
  'โ':  { type: '母音', name: 'サーラ・オー', sound: 'oo (長)' },
  'ไ':  { type: '母音', name: 'サーラ・アイ', sound: 'ai' },
  'ใ':  { type: '母音', name: 'サーラ・アイ（マイムアン）', sound: 'ai' },
  'ำ':  { type: '母音', name: 'サーラ・アム', sound: 'am' },
  '่':  { type: '声調', name: 'マイ・エーク', meaning: '声調記号1', rule: '声調を変える' },
  '้':  { type: '声調', name: 'マイ・トー', meaning: '声調記号2', rule: '声調を変える' },
  '๊':  { type: '声調', name: 'マイ・トリー', meaning: '声調記号3', rule: '声調を変える' },
  '๋':  { type: '声調', name: 'マイ・チャッタワー', meaning: '声調記号4', rule: '声調を変える' },
  '์':  { type: '記号', name: 'ガラン', meaning: '発音しない記号' },
};

// 学習フレーズデータ（約300問）
const PHRASE_DATA = [
  // --- 挨拶 ---
  { id: 1, category: '挨拶', thai: 'สวัสดี', phonetic: 'Sawasdee', kana: 'サワッディー', meaning: 'こんにちは', description: '基本の挨拶です。手を合わせて（ワイをして）言いましょう。', breakdown: [{ char: 'ส', ...CHAR_DB['ส'] }, { char: 'วั', type: '音節', sound: 'sa', toneRule: '高類(ส) + 短母音 = 低声(low)になるはずですが、慣用的に上昇気味に発音されます。' }, { char: 'ส', ...CHAR_DB['ส'] }, { char: 'ดี', type: '音節', sound: 'dee', toneRule: '中類(ด) + 長母音(ี) = 平声 (Mid)。' }] },
  { id: 2, category: '挨拶', thai: 'ขอบคุณ', phonetic: 'Khop khun', kana: 'コープクン', meaning: 'ありがとう', description: '感謝を伝える言葉。目上の人には深く頭を下げましょう。', breakdown: [{ char: 'ขอบ', type: '音節', sound: 'khop', toneRule: '高類(ข) + 死音(บ) = 低声 (Low)。' }, { char: 'คุณ', type: '音節', sound: 'khun', toneRule: '低類(ค) + 生音(ณ) = 平声 (Mid)。' }] },
  { id: 3, category: '挨拶', thai: 'ขอโทษ', phonetic: 'Kho thot', kana: 'コートート', meaning: 'ごめんなさい/すみません', breakdown: [] },
  { id: 4, category: '挨拶', thai: 'โชคดี', phonetic: 'Chok dee', kana: 'チョークディー', meaning: '幸運を/頑張って', breakdown: [] },
  { id: 5, category: '挨拶', thai: 'สบายดีไหม', phonetic: 'Sabai dee mai', kana: 'サバーイディーマイ？', meaning: '元気ですか？', breakdown: [] },
  { id: 6, category: '挨拶', thai: 'สบายดี', phonetic: 'Sabai dee', kana: 'サバーイディー', meaning: '元気です', breakdown: [] },
  { id: 7, category: '挨拶', thai: 'ไม่ค่อยสบาย', phonetic: 'Mai koi sabai', kana: 'マイコイサバーイ', meaning: 'あまり元気じゃない', breakdown: [] },
  { id: 8, category: '挨拶', thai: 'แล้วคุณล่ะ', phonetic: 'Laew khun la', kana: 'レウクンラ？', meaning: 'あなたは？', breakdown: [] },
  { id: 9, category: '挨拶', thai: 'ยินดีที่ได้รู้จัก', phonetic: 'Yin dee tee dai roo jak', kana: 'インディーティーダイルーチャック', meaning: 'はじめまして', breakdown: [] },
  { id: 10, category: '挨拶', thai: 'ชื่ออะไร', phonetic: 'Chue arai', kana: 'チューアライ？', meaning: '名前は何ですか？', breakdown: [] },
  { id: 11, category: '挨拶', thai: 'ชื่อ...', phonetic: 'Chue...', kana: 'チュー...', meaning: '名前は...です', breakdown: [] },
  { id: 12, category: '挨拶', thai: 'มาจากไหน', phonetic: 'Ma jak nai', kana: 'マージャークナイ？', meaning: 'どこから来ましたか？', breakdown: [] },
  { id: 13, category: '挨拶', thai: 'มาจากญี่ปุ่น', phonetic: 'Ma jak yipun', kana: 'マージャークイープン', meaning: '日本から来ました', breakdown: [] },
  { id: 14, category: '挨拶', thai: 'อายุเท่าไหร่', phonetic: 'Ayu thao rai', kana: 'アーユタオライ？', meaning: '何歳ですか？', breakdown: [] },
  { id: 15, category: '挨拶', thai: 'ลาก่อน', phonetic: 'La gon', kana: 'ラーゴーン', meaning: 'さようなら（長期間）', breakdown: [] },
  { id: 16, category: '挨拶', thai: 'เจอกันใหม่', phonetic: 'Jer gan mai', kana: 'ジューガンマイ', meaning: 'また会いましょう', breakdown: [] },
  { id: 17, category: '挨拶', thai: 'ราตรีสวัสดิ์', phonetic: 'Ra tree sawasdee', kana: 'ラートリーサワッ', meaning: 'おやすみなさい（公的）', breakdown: [] },
  { id: 18, category: '挨拶', thai: 'ฝันดี', phonetic: 'Fan dee', kana: 'ファンディー', meaning: 'おやすみ（良い夢を）', breakdown: [] },
  { id: 19, category: '挨拶', thai: 'ครับ', phonetic: 'Khrap', kana: 'クラップ', meaning: 'はい/語尾（男性）', breakdown: [] },
  { id: 20, category: '挨拶', thai: 'ค่ะ', phonetic: 'Kha', kana: 'カー', meaning: 'はい/語尾（女性）', breakdown: [] },

  // --- 数字 ---
  { id: 100, category: '数字', thai: 'ศูนย์', phonetic: 'Soon', kana: 'スーン', meaning: '0', breakdown: [] },
  { id: 101, category: '数字', thai: 'หนึ่ง', phonetic: 'Nueng', kana: 'ヌン', meaning: '1', breakdown: [] },
  { id: 102, category: '数字', thai: 'สอง', phonetic: 'Song', kana: 'ソーン', meaning: '2', breakdown: [] },
  { id: 103, category: '数字', thai: 'สาม', phonetic: 'Sam', kana: 'サーム', meaning: '3', breakdown: [] },
  { id: 104, category: '数字', thai: 'สี่', phonetic: 'See', kana: 'シー', meaning: '4', breakdown: [] },
  { id: 105, category: '数字', thai: 'ห้า', phonetic: 'Haa', kana: 'ハー', meaning: '5', breakdown: [] },
  { id: 106, category: '数字', thai: 'หก', phonetic: 'Hok', kana: 'ホック', meaning: '6', breakdown: [] },
  { id: 107, category: '数字', thai: 'เจ็ด', phonetic: 'Jet', kana: 'ジェット', meaning: '7', breakdown: [] },
  { id: 108, category: '数字', thai: 'แปด', phonetic: 'Paet', kana: 'ペェート', meaning: '8', breakdown: [] },
  { id: 109, category: '数字', thai: 'เก้า', phonetic: 'Kao', kana: 'ガーオ', meaning: '9', breakdown: [] },
  { id: 110, category: '数字', thai: 'สิบ', phonetic: 'Sip', kana: 'スィップ', meaning: '10', breakdown: [] },
  { id: 111, category: '数字', thai: 'สิบเอ็ด', phonetic: 'Sip et', kana: 'スィップエット', meaning: '11', breakdown: [] },
  { id: 112, category: '数字', thai: 'สิบสอง', phonetic: 'Sip song', kana: 'スィップソーン', meaning: '12', breakdown: [] },
  { id: 113, category: '数字', thai: 'ยี่สิบ', phonetic: 'Yi sip', kana: 'イースィップ', meaning: '20', breakdown: [] },
  { id: 114, category: '数字', thai: 'ยี่สิบเอ็ด', phonetic: 'Yi sip et', kana: 'イースィップエット', meaning: '21', breakdown: [] },
  { id: 115, category: '数字', thai: 'สามสิบ', phonetic: 'Sam sip', kana: 'サームスィップ', meaning: '30', breakdown: [] },
  { id: 116, category: '数字', thai: 'สี่สิบ', phonetic: 'See sip', kana: 'シースィップ', meaning: '40', breakdown: [] },
  { id: 117, category: '数字', thai: 'ห้าสิบ', phonetic: 'Haa sip', kana: 'ハースィップ', meaning: '50', breakdown: [] },
  { id: 118, category: '数字', thai: 'หนึ่งร้อย', phonetic: 'Nueng roi', kana: 'ヌンローイ', meaning: '100', breakdown: [] },
  { id: 119, category: '数字', thai: 'ห้าร้อย', phonetic: 'Haa roi', kana: 'ハーローイ', meaning: '500', breakdown: [] },
  { id: 120, category: '数字', thai: 'หนึ่งพัน', phonetic: 'Nueng phan', kana: 'ヌンパン', meaning: '1,000', breakdown: [] },
  { id: 121, category: '数字', thai: 'หนึ่งหมื่น', phonetic: 'Nueng muen', kana: 'ヌンムーン', meaning: '10,000', breakdown: [] },
  { id: 122, category: '数字', thai: 'หนึ่งแสน', phonetic: 'Nueng saen', kana: 'ヌンセーン', meaning: '100,000', breakdown: [] },
  { id: 123, category: '数字', thai: 'หนึ่งล้าน', phonetic: 'Nueng lan', kana: 'ヌンラーン', meaning: '1,000,000', breakdown: [] },
  { id: 124, category: '数字', thai: 'ครึ่ง', phonetic: 'Krueng', kana: 'クルン', meaning: '半分', breakdown: [] },
  { id: 125, category: '数字', thai: 'นิดหน่อย', phonetic: 'Nit noi', kana: 'ニッノイ', meaning: '少し', breakdown: [] },
  { id: 126, category: '数字', thai: 'เยอะ', phonetic: 'Yoe', kana: 'ユッ', meaning: 'たくさん', breakdown: [] },
  { id: 127, category: '数字', thai: 'ทั้งหมด', phonetic: 'Tang mot', kana: 'タンモット', meaning: '全部', breakdown: [] },
  { id: 128, category: '数字', thai: 'ครั้งที่หนึ่ง', phonetic: 'Khrang tee nueng', kana: 'クランティーヌン', meaning: '1回目', breakdown: [] },
  { id: 129, category: '数字', thai: 'แรก', phonetic: 'Raek', kana: 'レーク', meaning: '最初', breakdown: [] },
  { id: 130, category: '数字', thai: 'สุดท้าย', phonetic: 'Sut tai', kana: 'スッターイ', meaning: '最後', breakdown: [] },

  // --- 人・代名詞 ---
  { id: 201, category: '人', thai: 'ผม', phonetic: 'Phom', kana: 'ポム', meaning: '私（男性）', breakdown: [] },
  { id: 202, category: '人', thai: 'ฉัน', phonetic: 'Chan', kana: 'チャン', meaning: '私（女性/一般的）', breakdown: [] },
  { id: 203, category: '人', thai: 'คุณ', phonetic: 'Khun', kana: 'クン', meaning: 'あなた', breakdown: [] },
  { id: 204, category: '人', thai: 'เขา', phonetic: 'Khao', kana: 'カオ', meaning: '彼 / 彼女', breakdown: [] },
  { id: 205, category: '人', thai: 'เรา', phonetic: 'Rao', kana: 'ラオ', meaning: '私たち/僕', breakdown: [] },
  { id: 206, category: '人', thai: 'พวกเขา', phonetic: 'Phuak khao', kana: 'プアッカオ', meaning: '彼ら', breakdown: [] },
  { id: 207, category: '人', thai: 'พี่', phonetic: 'Pee', kana: 'ピー', meaning: '年上の人（兄/姉）', breakdown: [] },
  { id: 208, category: '人', thai: 'น้อง', phonetic: 'Nong', kana: 'ノーン', meaning: '年下の人（弟/妹）', breakdown: [] },
  { id: 209, category: '人', thai: 'คน', phonetic: 'Khon', kana: 'コン', meaning: '人', breakdown: [] },
  { id: 210, category: '人', thai: 'ผู้ชาย', phonetic: 'Poo chai', kana: 'プーチャーイ', meaning: '男性', breakdown: [] },
  { id: 211, category: '人', thai: 'ผู้หญิง', phonetic: 'Poo ying', kana: 'プーイン', meaning: '女性', breakdown: [] },
  { id: 212, category: '人', thai: 'เด็ก', phonetic: 'Dek', kana: 'デック', meaning: '子供', breakdown: [] },
  { id: 213, category: '人', thai: 'เพื่อน', phonetic: 'Puean', kana: 'プアン', meaning: '友達', breakdown: [] },
  { id: 214, category: '人', thai: 'แฟน', phonetic: 'Faen', kana: 'フェーン', meaning: '恋人', breakdown: [] },
  { id: 215, category: '人', thai: 'คนไทย', phonetic: 'Khon Thai', kana: 'コンタイ', meaning: 'タイ人', breakdown: [] },
  { id: 216, category: '人', thai: 'คนญี่ปุ่น', phonetic: 'Khon Yipun', kana: 'コンイープン', meaning: '日本人', breakdown: [] },

  // --- 家族 ---
  { id: 221, category: '家族', thai: 'ครอบครัว', phonetic: 'Krop krua', kana: 'クロップクルア', meaning: '家族', breakdown: [] },
  { id: 222, category: '家族', thai: 'พ่อ', phonetic: 'Phor', kana: 'ポー', meaning: '父', breakdown: [] },
  { id: 223, category: '家族', thai: 'แม่', phonetic: 'Mae', kana: 'メー', meaning: '母', breakdown: [] },
  { id: 224, category: '家族', thai: 'ลูก', phonetic: 'Look', kana: 'ルーク', meaning: '子供', breakdown: [] },
  { id: 225, category: '家族', thai: 'พี่ชาย', phonetic: 'Pee chai', kana: 'ピーチャーイ', meaning: '兄', breakdown: [] },
  { id: 226, category: '家族', thai: 'พี่สาว', phonetic: 'Pee sao', kana: 'ピーサーオ', meaning: '姉', breakdown: [] },
  { id: 227, category: '家族', thai: 'น้องชาย', phonetic: 'Nong chai', kana: 'ノーンチャーイ', meaning: '弟', breakdown: [] },
  { id: 228, category: '家族', thai: 'น้องสาว', phonetic: 'Nong sao', kana: 'ノーンサーオ', meaning: '妹', breakdown: [] },
  { id: 229, category: '家族', thai: 'ปู่/ตา', phonetic: 'Poo/Ta', kana: 'プー/ター', meaning: '祖父', breakdown: [] },
  { id: 230, category: '家族', thai: 'ย่า/ยาย', phonetic: 'Ya/Yai', kana: 'ヤー/ヤーイ', meaning: '祖母', breakdown: [] },

  // --- 疑問詞 ---
  { id: 301, category: '疑問詞', thai: 'อะไร', phonetic: 'Arai', kana: 'アライ', meaning: '何？', breakdown: [] },
  { id: 302, category: '疑問詞', thai: 'ที่ไหน', phonetic: 'Tee nai', kana: 'ティーナイ', meaning: 'どこ？', breakdown: [] },
  { id: 303, category: '疑問詞', thai: 'เมื่อไหร่', phonetic: 'Muea rai', kana: 'ムアライ', meaning: 'いつ？', breakdown: [] },
  { id: 304, category: '疑問詞', thai: 'ใคร', phonetic: 'Krai', kana: 'クライ', meaning: '誰？', breakdown: [] },
  { id: 305, category: '疑問詞', thai: 'ทำไม', phonetic: 'Tam mai', kana: 'タンマイ', meaning: 'なぜ？', breakdown: [] },
  { id: 306, category: '疑問詞', thai: 'อย่างไร', phonetic: 'Yang rai', kana: 'ヤンライ', meaning: 'どうやって？', breakdown: [] },
  { id: 307, category: '疑問詞', thai: 'เท่าไหร่', phonetic: 'Thao rai', kana: 'タオライ', meaning: 'いくら？', breakdown: [] },
  { id: 308, category: '疑問詞', thai: 'กี่', phonetic: 'Kee', kana: 'ギー', meaning: 'いくつ？', breakdown: [] },
  { id: 309, category: '疑問詞', thai: 'อันไหน', phonetic: 'An nai', kana: 'アンナイ', meaning: 'どれ？', breakdown: [] },
  { id: 310, category: '疑問詞', thai: 'แบบไหน', phonetic: 'Baep nai', kana: 'ベープナイ', meaning: 'どんな種類？', breakdown: [] },
  { id: 311, category: '疑問詞', thai: 'ของใคร', phonetic: 'Khong krai', kana: 'コーンクライ', meaning: '誰の？', breakdown: [] },
  { id: 312, category: '疑問詞', thai: 'ทางไหน', phonetic: 'Tang nai', kana: 'ターンナイ', meaning: 'どっちの道？', breakdown: [] },
  { id: 313, category: '疑問詞', thai: 'จริงหรอ', phonetic: 'Jing ror', kana: 'チンロー？', meaning: '本当？', breakdown: [] },
  { id: 314, category: '疑問詞', thai: 'ไหม', phonetic: 'Mai', kana: 'マイ', meaning: '〜ですか？', breakdown: [] },
  { id: 315, category: '疑問詞', thai: 'หรือเปล่า', phonetic: 'Rue plao', kana: 'ルプラーオ', meaning: '〜ではないですか？', breakdown: [] },

  // --- 動詞 ---
  { id: 401, category: '動詞', thai: 'กิน', phonetic: 'Kin', kana: 'ギン', meaning: '食べる', breakdown: [] },
  { id: 402, category: '動詞', thai: 'ดื่ม', phonetic: 'Duem', kana: 'ドゥーム', meaning: '飲む', breakdown: [] },
  { id: 403, category: '動詞', thai: 'ไป', phonetic: 'Pai', kana: 'パイ', meaning: '行く', breakdown: [] },
  { id: 404, category: '動詞', thai: 'มา', phonetic: 'Ma', kana: 'マー', meaning: '来る', breakdown: [] },
  { id: 405, category: '動詞', thai: 'นอน', phonetic: 'Non', kana: 'ノーン', meaning: '寝る', breakdown: [] },
  { id: 406, category: '動詞', thai: 'ตื่น', phonetic: 'Tuen', kana: 'トゥーン', meaning: '起きる', breakdown: [] },
  { id: 407, category: '動詞', thai: 'ดู', phonetic: 'Doo', kana: 'ドゥー', meaning: '見る', breakdown: [] },
  { id: 408, category: '動詞', thai: 'ฟัง', phonetic: 'Fang', kana: 'ファン', meaning: '聞く', breakdown: [] },
  { id: 409, category: '動詞', thai: 'พูด', phonetic: 'Poot', kana: 'プート', meaning: '話す', breakdown: [] },
  { id: 410, category: '動詞', thai: 'อ่าน', phonetic: 'Aan', kana: 'アーン', meaning: '読む', breakdown: [] },
  { id: 411, category: '動詞', thai: 'เขียน', phonetic: 'Khian', kana: 'キアン', meaning: '書く', breakdown: [] },
  { id: 412, category: '動詞', thai: 'ทำ', phonetic: 'Tam', kana: 'タム', meaning: 'する', breakdown: [] },
  { id: 413, category: '動詞', thai: 'ชอบ', phonetic: 'Chop', kana: 'チョープ', meaning: '好き', breakdown: [] },
  { id: 414, category: '動詞', thai: 'รัก', phonetic: 'Rak', kana: 'ラック', meaning: '愛する', breakdown: [] },
  { id: 415, category: '動詞', thai: 'เกลียด', phonetic: 'Kliat', kana: 'クリアット', meaning: '嫌い', breakdown: [] },
  { id: 416, category: '動詞', thai: 'เข้าใจ', phonetic: 'Khao jai', kana: 'カオジャイ', meaning: '理解する', breakdown: [] },
  { id: 417, category: '動詞', thai: 'รู้', phonetic: 'Roo', kana: 'ルー', meaning: '知る', breakdown: [] },
  { id: 418, category: '動詞', thai: 'รู้จัก', phonetic: 'Roo jak', kana: 'ルーチャック', meaning: '知っている', breakdown: [] },
  { id: 419, category: '動詞', thai: 'จำ', phonetic: 'Jam', kana: 'ジャム', meaning: '覚える', breakdown: [] },
  { id: 420, category: '動詞', thai: 'ลืม', phonetic: 'Luem', kana: 'ルーム', meaning: '忘れる', breakdown: [] },
  { id: 421, category: '動詞', thai: 'คิด', phonetic: 'Kid', kana: 'キッド', meaning: '考える', breakdown: [] },
  { id: 422, category: '動詞', thai: 'ต้องการ', phonetic: 'Tong kan', kana: 'トンガーン', meaning: '欲しい（丁寧）', breakdown: [] },
  { id: 423, category: '動詞', thai: 'อยาก', phonetic: 'Yak', kana: 'ヤーク', meaning: '〜したい', breakdown: [] },
  { id: 424, category: '動詞', thai: 'เอา', phonetic: 'Ao', kana: 'アオ', meaning: '要る', breakdown: [] },
  { id: 425, category: '動詞', thai: 'มี', phonetic: 'Mee', kana: 'ミー', meaning: 'ある', breakdown: [] },
  { id: 426, category: '動詞', thai: 'ไม่มี', phonetic: 'Mai mee', kana: 'マイミー', meaning: 'ない', breakdown: [] },
  { id: 427, category: '動詞', thai: 'ใช่', phonetic: 'Chai', kana: 'チャイ', meaning: 'はい（そう）', breakdown: [] },
  { id: 428, category: '動詞', thai: 'ไม่ใช่', phonetic: 'Mai chai', kana: 'マイチャイ', meaning: 'いいえ（違う）', breakdown: [] },
  { id: 429, category: '動詞', thai: 'ช่วย', phonetic: 'Chuay', kana: 'チュアイ', meaning: '助ける', breakdown: [] },
  { id: 430, category: '動詞', thai: 'รอ', phonetic: 'Ror', kana: 'ロー', meaning: '待つ', breakdown: [] },
  { id: 431, category: '動詞', thai: 'หยุด', phonetic: 'Yut', kana: 'ユット', meaning: '止まる', breakdown: [] },
  { id: 432, category: '動詞', thai: 'เดิน', phonetic: 'Doen', kana: 'ドゥーン', meaning: '歩く', breakdown: [] },
  { id: 433, category: '動詞', thai: 'วิ่ง', phonetic: 'Wing', kana: 'ウィン', meaning: '走る', breakdown: [] },
  { id: 434, category: '動詞', thai: 'นั่ง', phonetic: 'Nang', kana: 'ナン', meaning: '座る', breakdown: [] },
  { id: 435, category: '動詞', thai: 'ยืน', phonetic: 'Yuen', kana: 'ユーン', meaning: '立つ', breakdown: [] },
  { id: 436, category: '動詞', thai: 'เข้า', phonetic: 'Khao', kana: 'カオ', meaning: '入る', breakdown: [] },
  { id: 437, category: '動詞', thai: 'ออก', phonetic: 'Ook', kana: 'オーク', meaning: '出る', breakdown: [] },
  { id: 438, category: '動詞', thai: 'เปิด', phonetic: 'Poet', kana: 'プート', meaning: '開ける', breakdown: [] },
  { id: 439, category: '動詞', thai: 'ปิด', phonetic: 'Pit', kana: 'ピット', meaning: '閉める', breakdown: [] },
  { id: 440, category: '動詞', thai: 'ซื้อ', phonetic: 'Sue', kana: 'スー', meaning: '買う', breakdown: [] },
  { id: 441, category: '動詞', thai: 'ขาย', phonetic: 'Khai', kana: 'カーイ', meaning: '売る', breakdown: [] },
  { id: 442, category: '動詞', thai: 'จ่าย', phonetic: 'Jai', kana: 'ジャーイ', meaning: '払う', breakdown: [] },
  { id: 443, category: '動詞', thai: 'เรียน', phonetic: 'Rian', kana: 'リアン', meaning: '勉強する', breakdown: [] },
  { id: 444, category: '動詞', thai: 'ทำงาน', phonetic: 'Tam ngan', kana: 'タムガーン', meaning: '仕事する', breakdown: [] },
  { id: 445, category: '動詞', thai: 'เล่น', phonetic: 'Len', kana: 'レン', meaning: '遊ぶ', breakdown: [] },
  { id: 446, category: '動詞', thai: 'กลับ', phonetic: 'Klap', kana: 'クラップ', meaning: '帰る', breakdown: [] },
  { id: 447, category: '動詞', thai: 'ถาม', phonetic: 'Tam', kana: 'ターム', meaning: '質問する', breakdown: [] },
  { id: 448, category: '動詞', thai: 'ตอบ', phonetic: 'Top', kana: 'トープ', meaning: '答える', breakdown: [] },
  { id: 449, category: '動詞', thai: 'หา', phonetic: 'Ha', kana: 'ハー', meaning: '探す', breakdown: [] },
  { id: 450, category: '動詞', thai: 'พบ', phonetic: 'Pop', kana: 'ポップ', meaning: '会う', breakdown: [] },
  { id: 451, category: '動詞', thai: 'ใช้', phonetic: 'Chai', kana: 'チャイ', meaning: '使う', breakdown: [] },
  { id: 452, category: '動詞', thai: 'ให้', phonetic: 'Hai', kana: 'ハイ', meaning: 'あげる', breakdown: [] },
  { id: 453, category: '動詞', thai: 'รับ', phonetic: 'Rap', kana: 'ラップ', meaning: '受け取る', breakdown: [] },
  { id: 454, category: '動詞', thai: 'ส่ง', phonetic: 'Song', kana: 'ソン', meaning: '送る', breakdown: [] },
  { id: 455, category: '動詞', thai: 'ล้าง', phonetic: 'Lang', kana: 'ラーン', meaning: '洗う', breakdown: [] },
  { id: 456, category: '動詞', thai: 'ซัก', phonetic: 'Sak', kana: 'サック', meaning: '洗濯する', breakdown: [] },
  { id: 457, category: '動詞', thai: 'ขับ', phonetic: 'Khap', kana: 'カップ', meaning: '運転する', breakdown: [] },
  { id: 458, category: '動詞', thai: 'ขี่', phonetic: 'Khee', kana: 'キー', meaning: '乗る', breakdown: [] },
  { id: 459, category: '動詞', thai: 'ยืม', phonetic: 'Yuem', kana: 'ユーム', meaning: '借りる', breakdown: [] },
  { id: 460, category: '動詞', thai: 'คืน', phonetic: 'Khuen', kana: 'クーン', meaning: '返す', breakdown: [] },

  // --- 形容詞 ---
  { id: 501, category: '形容詞', thai: 'ร้อน', phonetic: 'Ron', kana: 'ローン', meaning: '暑い', breakdown: [] },
  { id: 502, category: '形容詞', thai: 'หนาว', phonetic: 'Nao', kana: 'ナーオ', meaning: '寒い', breakdown: [] },
  { id: 503, category: '形容詞', thai: 'เย็น', phonetic: 'Yen', kana: 'イェン', meaning: '涼しい', breakdown: [] },
  { id: 504, category: '形容詞', thai: 'ใหญ่', phonetic: 'Yai', kana: 'ヤイ', meaning: '大きい', breakdown: [] },
  { id: 505, category: '形容詞', thai: 'เล็ก', phonetic: 'Lek', kana: 'レック', meaning: '小さい', breakdown: [] },
  { id: 506, category: '形容詞', thai: 'เผ็ด', phonetic: 'Phet', kana: 'ペット', meaning: '辛い', breakdown: [] },
  { id: 507, category: '形容詞', thai: 'หวาน', phonetic: 'Wan', kana: 'ワーン', meaning: '甘い', breakdown: [] },
  { id: 508, category: '形容詞', thai: 'เปรี้ยว', phonetic: 'Preaw', kana: 'プリアオ', meaning: '酸っぱい', breakdown: [] },
  { id: 509, category: '形容詞', thai: 'เค็ม', phonetic: 'Kem', kana: 'ケム', meaning: 'しょっぱい', breakdown: [] },
  { id: 510, category: '形容詞', thai: 'อร่อย', phonetic: 'Aroi', kana: 'アロイ', meaning: '美味しい', breakdown: [] },
  { id: 511, category: '形容詞', thai: 'สวย', phonetic: 'Suay', kana: 'スアイ', meaning: '美しい', breakdown: [] },
  { id: 512, category: '形容詞', thai: 'น่ารัก', phonetic: 'Narak', kana: 'ナーラック', meaning: '可愛い', breakdown: [] },
  { id: 513, category: '形容詞', thai: 'หล่อ', phonetic: 'Lor', kana: 'ロー', meaning: 'ハンサム', breakdown: [] },
  { id: 514, category: '形容詞', thai: 'แพง', phonetic: 'Paeng', kana: 'ペーン', meaning: '高い', breakdown: [] },
  { id: 515, category: '形容詞', thai: 'ถูก', phonetic: 'Took', kana: 'トゥーク', meaning: '安い', breakdown: [] },
  { id: 516, category: '形容詞', thai: 'สนุก', phonetic: 'Sanuk', kana: 'サヌック', meaning: '楽しい', breakdown: [] },
  { id: 517, category: '形容詞', thai: 'ดี', phonetic: 'Dee', kana: 'ディー', meaning: '良い', breakdown: [] },
  { id: 518, category: '形容詞', thai: 'ไม่ดี', phonetic: 'Mai dee', kana: 'マイディー', meaning: '良くない', breakdown: [] },
  { id: 519, category: '形容詞', thai: 'เก่ง', phonetic: 'Keng', kana: 'ケング', meaning: '上手', breakdown: [] },
  { id: 520, category: '形容詞', thai: 'ยาก', phonetic: 'Yak', kana: 'ヤーク', meaning: '難しい', breakdown: [] },
  { id: 521, category: '形容詞', thai: 'ง่าย', phonetic: 'Ngai', kana: 'ガーイ', meaning: '簡単', breakdown: [] },
  { id: 522, category: '形容詞', thai: 'เร็ว', phonetic: 'Reo', kana: 'レオ', meaning: '速い', breakdown: [] },
  { id: 523, category: '形容詞', thai: 'ช้า', phonetic: 'Cha', kana: 'チャー', meaning: '遅い', breakdown: [] },
  { id: 524, category: '形容詞', thai: 'หนัก', phonetic: 'Nak', kana: 'ナック', meaning: '重い', breakdown: [] },
  { id: 525, category: '形容詞', thai: 'เบา', phonetic: 'Bao', kana: 'バオ', meaning: '軽い', breakdown: [] },
  { id: 526, category: '形容詞', thai: 'ใหม่', phonetic: 'Mai', kana: 'マイ', meaning: '新しい', breakdown: [] },
  { id: 527, category: '形容詞', thai: 'เก่า', phonetic: 'Kao', kana: 'ガオ', meaning: '古い', breakdown: [] },
  { id: 528, category: '形容詞', thai: 'ไกล', phonetic: 'Klai', kana: 'クライ', meaning: '遠い', breakdown: [] },
  { id: 529, category: '形容詞', thai: 'ใกล้', phonetic: 'Klai', kana: 'クライ', meaning: '近い', breakdown: [] },
  { id: 530, category: '形容詞', thai: 'สะอาด', phonetic: 'Sa-at', kana: 'サアート', meaning: '清潔', breakdown: [] },
  { id: 531, category: '形容詞', thai: 'สกปรก', phonetic: 'Sok-ka-prok', kana: 'ソッカプロック', meaning: '汚い', breakdown: [] },
  { id: 532, category: '形容詞', thai: 'เหนื่อย', phonetic: 'Nueai', kana: 'ヌアイ', meaning: '疲れた', breakdown: [] },
  { id: 533, category: '形容詞', thai: 'ง่วง', phonetic: 'Nguang', kana: 'グアン', meaning: '眠い', breakdown: [] },
  { id: 534, category: '形容詞', thai: 'หิว', phonetic: 'Hiw', kana: 'ヒウ', meaning: 'お腹すいた', breakdown: [] },
  { id: 535, category: '形容詞', thai: 'อิ่ม', phonetic: 'Im', kana: 'イム', meaning: '満腹', breakdown: [] },
  { id: 536, category: '形容詞', thai: 'สว่าง', phonetic: 'Sawang', kana: 'サワーン', meaning: '明るい', breakdown: [] },
  { id: 537, category: '形容詞', thai: 'มืด', phonetic: 'Muet', kana: 'ムート', meaning: '暗い', breakdown: [] },
  { id: 538, category: '形容詞', thai: 'ดัง', phonetic: 'Dang', kana: 'ダン', meaning: 'うるさい', breakdown: [] },
  { id: 539, category: '形容詞', thai: 'เงียบ', phonetic: 'Ngiap', kana: 'ギアッ', meaning: '静か', breakdown: [] },
  { id: 540, category: '形容詞', thai: 'สำคัญ', phonetic: 'Samkhan', kana: 'サムカン', meaning: '重要', breakdown: [] },
  { id: 541, category: '形容詞', thai: 'เหมือน', phonetic: 'Muean', kana: 'ムアン', meaning: '同じ', breakdown: [] },
  { id: 542, category: '形容詞', thai: 'ต่าง', phonetic: 'Tang', kana: 'ターン', meaning: '違う', breakdown: [] },
  
  // --- 色 ---
  { id: 550, category: '色', thai: 'สี', phonetic: 'See', kana: 'シー', meaning: '色', breakdown: [] },
  { id: 551, category: '色', thai: 'สีแดง', phonetic: 'See daeng', kana: 'シーデーン', meaning: '赤', breakdown: [] },
  { id: 552, category: '色', thai: 'สีน้ำเงิน', phonetic: 'See nam ngoen', kana: 'シーナムグン', meaning: '青', breakdown: [] },
  { id: 553, category: '色', thai: 'สีฟ้า', phonetic: 'See fa', kana: 'シーファー', meaning: '水色', breakdown: [] },
  { id: 554, category: '色', thai: 'สีเหลือง', phonetic: 'See lueang', kana: 'シー ルアン', meaning: '黄色', breakdown: [] },
  { id: 555, category: '色', thai: 'สีเขียว', phonetic: 'See khiao', kana: 'シーキアオ', meaning: '緑', breakdown: [] },
  { id: 556, category: '色', thai: 'สีขาว', phonetic: 'See khao', kana: 'シーカーオ', meaning: '白', breakdown: [] },
  { id: 557, category: '色', thai: 'สีดำ', phonetic: 'See dam', kana: 'シーダム', meaning: '黒', breakdown: [] },
  { id: 558, category: '色', thai: 'สีชมพู', phonetic: 'See chompoo', kana: 'シーチョンプー', meaning: 'ピンク', breakdown: [] },
  { id: 559, category: '色', thai: 'สีส้ม', phonetic: 'See som', kana: 'シーソム', meaning: 'オレンジ', breakdown: [] },
  { id: 560, category: '色', thai: 'สีม่วง', phonetic: 'See muang', kana: 'シームアン', meaning: '紫', breakdown: [] },
  { id: 561, category: '色', thai: 'สีน้ำตาล', phonetic: 'See nam tan', kana: 'シーナムターン', meaning: '茶色', breakdown: [] },
  { id: 562, category: '色', thai: 'สีเทา', phonetic: 'See tao', kana: 'シータオ', meaning: '灰色', breakdown: [] },
  { id: 563, category: '色', thai: 'สีทอง', phonetic: 'See thong', kana: 'シートーン', meaning: '金', breakdown: [] },
  { id: 564, category: '色', thai: 'สีเงิน', phonetic: 'See ngoen', kana: 'シーグン', meaning: '銀', breakdown: [] },

  // --- 買い物 ---
  { id: 601, category: '買い物', thai: 'เท่าไหร่', phonetic: 'Thao rai', kana: 'タオライ？', meaning: 'いくら？', breakdown: [] },
  { id: 602, category: '買い物', thai: 'ลดได้ไหม', phonetic: 'Lot dai mai', kana: 'ロットダイマイ？', meaning: 'まけて？', breakdown: [] },
  { id: 628, category: '買い物', thai: 'เสื้อ', phonetic: 'Suea', kana: 'スア', meaning: '服', breakdown: [] },
  { id: 629, category: '買い物', thai: 'กางเกง', phonetic: 'Kangkeng', kana: 'ガーンゲーン', meaning: 'ズボン', breakdown: [] },
  { id: 630, category: '買い物', thai: 'กระเป๋า', phonetic: 'Krapao', kana: 'グラパオ', meaning: '鞄', breakdown: [] },
  { id: 631, category: '買い物', thai: 'รองเท้า', phonetic: 'Rongtao', kana: 'ロンタオ', meaning: '靴', breakdown: [] },
  { id: 634, category: '買い物', thai: 'ถุง', phonetic: 'Tung', kana: 'トゥン', meaning: '袋', breakdown: [] },
  { id: 635, category: '買い物', thai: 'เงิน', phonetic: 'Ngoen', kana: 'グン', meaning: 'お金', breakdown: [] },
  { id: 636, category: '買い物', thai: 'บัตรเครดิต', phonetic: 'Bat credit', kana: 'バックレディッ', meaning: 'クレジットカード', breakdown: [] },

  // --- 食事 ---
  { id: 603, category: '食事', thai: 'อาหาร', phonetic: 'Ahan', kana: 'アーハーン', meaning: '料理', breakdown: [] },
  { id: 604, category: '食事', thai: 'ข้าว', phonetic: 'Khao', kana: 'カーオ', meaning: 'ご飯', breakdown: [] },
  { id: 605, category: '食事', thai: 'น้ำ', phonetic: 'Nam', kana: 'ナーム', meaning: '水', breakdown: [] },
  { id: 606, category: '食事', thai: 'น้ำแข็ง', phonetic: 'Nam khaeng', kana: 'ナムケン', meaning: '氷', breakdown: [] },
  { id: 607, category: '食事', thai: 'กาแฟ', phonetic: 'Ka fae', kana: 'ガーフェー', meaning: 'コーヒー', breakdown: [] },
  { id: 608, category: '食事', thai: 'ชา', phonetic: 'Cha', kana: 'チャー', meaning: 'お茶', breakdown: [] },
  { id: 609, category: '食事', thai: 'เบียร์', phonetic: 'Bia', kana: 'ビア', meaning: 'ビール', breakdown: [] },
  { id: 610, category: '食事', thai: 'ก๋วยเตี๋ยว', phonetic: 'Kuay tiao', kana: 'クイッティアオ', meaning: 'ラーメン', breakdown: [] },
  { id: 611, category: '食事', thai: 'ผัดไทย', phonetic: 'Pad Thai', kana: 'パッタイ', meaning: 'パッタイ', breakdown: [] },
  { id: 612, category: '食事', thai: 'ต้มยำกุ้ง', phonetic: 'Tom Yam Kung', kana: 'トムヤムクン', meaning: 'トムヤムクン', breakdown: [] },
  { id: 613, category: '食事', thai: 'ส้มตำ', phonetic: 'Som Tam', kana: 'ソムタム', meaning: 'ソムタム', breakdown: [] },
  { id: 614, category: '食事', thai: 'ไก่ย่าง', phonetic: 'Gai Yang', kana: 'ガイヤーン', meaning: 'ガイヤーン', breakdown: [] },
  { id: 615, category: '食事', thai: 'ข้าวผัด', phonetic: 'Khao Pad', kana: 'カオパット', meaning: 'チャーハン', breakdown: [] },
  { id: 616, category: '食事', thai: 'แกงเขียวหวาน', phonetic: 'Kaeng Khiao Wan', kana: 'ゲーンキアオワーン', meaning: 'グリーンカレー', breakdown: [] },
  { id: 617, category: '食事', thai: 'ผลไม้', phonetic: 'Ponlamai', kana: 'ポンラマーイ', meaning: '果物', breakdown: [] },
  { id: 618, category: '食事', thai: 'ทุเรียน', phonetic: 'Turian', kana: 'トゥリアン', meaning: 'ドリアン', breakdown: [] },
  { id: 619, category: '食事', thai: 'มะม่วง', phonetic: 'Mamuang', kana: 'マムアン', meaning: 'マンゴー', breakdown: [] },
  { id: 620, category: '食事', thai: 'มังคุด', phonetic: 'Mangkut', kana: 'マンクット', meaning: 'マンゴスチン', breakdown: [] },
  { id: 621, category: '食事', thai: 'กล้วย', phonetic: 'Kluay', kana: 'クルアイ', meaning: 'バナナ', breakdown: [] },
  { id: 622, category: '食事', thai: 'หมู', phonetic: 'Moo', kana: 'ムー', meaning: '豚肉', breakdown: [] },
  { id: 623, category: '食事', thai: 'ไก่', phonetic: 'Gai', kana: 'ガイ', meaning: '鶏肉', breakdown: [] },
  { id: 624, category: '食事', thai: 'เนื้อ', phonetic: 'Nuea', kana: 'ヌア', meaning: '牛肉', breakdown: [] },
  { id: 625, category: '食事', thai: 'ปลา', phonetic: 'Pla', kana: 'プラー', meaning: '魚', breakdown: [] },
  { id: 626, category: '食事', thai: 'กุ้ง', phonetic: 'Kung', kana: 'クン', meaning: '海老', breakdown: [] },
  { id: 627, category: '食事', thai: 'ไข่', phonetic: 'Khai', kana: 'カイ', meaning: '卵', breakdown: [] },
  { id: 632, category: '食事', thai: 'เช็คบิล', phonetic: 'Check bin', kana: 'チェックビン', meaning: 'お会計', breakdown: [] },
  { id: 633, category: '食事', thai: 'เก็บตังค์', phonetic: 'Kep tang', kana: 'ケップタン', meaning: 'お勘定', breakdown: [] },
  { id: 637, category: '食事', thai: 'จาน', phonetic: 'Jan', kana: 'ジャーン', meaning: '皿', breakdown: [] },
  { id: 638, category: '食事', thai: 'ช้อน', phonetic: 'Chon', kana: 'チョーン', meaning: 'スプーン', breakdown: [] },
  { id: 639, category: '食事', thai: 'ส้อม', phonetic: 'Som', kana: 'ソーム', meaning: 'フォーク', breakdown: [] },
  { id: 640, category: '食事', thai: 'ตะเกียบ', phonetic: 'Takiap', kana: 'タキアッ', meaning: '箸', breakdown: [] },

  // --- 日時 ---
  { id: 701, category: '日時', thai: 'วันนี้', phonetic: 'Wan nee', kana: 'ワンニー', meaning: '今日', breakdown: [] },
  { id: 702, category: '日時', thai: 'พรุ่งนี้', phonetic: 'Prung nee', kana: 'プルンニー', meaning: '明日', breakdown: [] },
  { id: 703, category: '日時', thai: 'เมื่อวาน', phonetic: 'Muea wan', kana: 'ムアワーン', meaning: '昨日', breakdown: [] },
  { id: 704, category: '日時', thai: 'ตอนนี้', phonetic: 'Ton nee', kana: 'トンニー', meaning: '今', breakdown: [] },
  { id: 705, category: '日時', thai: 'วัน', phonetic: 'Wan', kana: 'ワン', meaning: '日/曜日', breakdown: [] },
  { id: 706, category: '日時', thai: 'เดือน', phonetic: 'Duean', kana: 'ドゥアン', meaning: '月', breakdown: [] },
  { id: 707, category: '日時', thai: 'ปี', phonetic: 'Pee', kana: 'ピー', meaning: '年', breakdown: [] },
  { id: 708, category: '日時', thai: 'เช้า', phonetic: 'Chao', kana: 'チャオ', meaning: '朝', breakdown: [] },
  { id: 709, category: '日時', thai: 'กลางวัน', phonetic: 'Klang wan', kana: 'クランワン', meaning: '昼', breakdown: [] },
  { id: 710, category: '日時', thai: 'เย็น', phonetic: 'Yen', kana: 'イェン', meaning: '夕方', breakdown: [] },
  { id: 711, category: '日時', thai: 'คืน', phonetic: 'Khuen', kana: 'クーン', meaning: '夜', breakdown: [] },
  { id: 712, category: '日時', thai: 'วันจันทร์', phonetic: 'Wan Jan', kana: 'ワンチャン', meaning: '月曜日', breakdown: [] },
  { id: 713, category: '日時', thai: 'วันอังคาร', phonetic: 'Wan Angkan', kana: 'ワンアンカーン', meaning: '火曜日', breakdown: [] },
  { id: 714, category: '日時', thai: 'วันพุธ', phonetic: 'Wan Put', kana: 'ワンプット', meaning: '水曜日', breakdown: [] },
  { id: 715, category: '日時', thai: 'วันพฤหัสบดี', phonetic: 'Wan Paruehat', kana: 'ワンパルハッ', meaning: '木曜日', breakdown: [] },
  { id: 716, category: '日時', thai: 'วันศุกร์', phonetic: 'Wan Suk', kana: 'ワンスック', meaning: '金曜日', breakdown: [] },
  { id: 717, category: '日時', thai: 'วันเสาร์', phonetic: 'Wan Sao', kana: 'ワンサオ', meaning: '土曜日', breakdown: [] },
  { id: 718, category: '日時', thai: 'วันอาทิตย์', phonetic: 'Wan Atit', kana: 'ワンアーティット', meaning: '日曜日', breakdown: [] },
  { id: 719, category: '日時', thai: 'มกราคม', phonetic: 'Mokarakhom', kana: 'モッカラーコム', meaning: '1月', breakdown: [] },
  { id: 720, category: '日時', thai: 'เมษายน', phonetic: 'Mesayon', kana: 'メーサーヨン', meaning: '4月', breakdown: [] },
  { id: 721, category: '日時', thai: 'เวลา', phonetic: 'Wela', kana: 'ウェラー', meaning: '時間', breakdown: [] },
  { id: 722, category: '日時', thai: 'นาที', phonetic: 'Natee', kana: 'ナーティー', meaning: '分', breakdown: [] },
  { id: 723, category: '日時', thai: 'ชั่วโมง', phonetic: 'Chua mong', kana: 'チュアモーン', meaning: '時間', breakdown: [] },
  { id: 724, category: '日時', thai: 'สัปดาห์', phonetic: 'Sap da', kana: 'サップダー', meaning: '週', breakdown: [] },
  { id: 725, category: '日時', thai: 'อาทิตย์หน้า', phonetic: 'Atit na', kana: 'アーティッナー', meaning: '来週', breakdown: [] },

  // --- 場所 ---
  { id: 801, category: '場所', thai: 'ห้องน้ำ', phonetic: 'Hong nam', kana: 'ホンナーム', meaning: 'トイレ', breakdown: [] },
  { id: 802, category: '場所', thai: 'ร้านอาหาร', phonetic: 'Ran ahan', kana: 'ラーンアーハーン', meaning: 'レストラン', breakdown: [] },
  { id: 803, category: '場所', thai: 'โรงพยาบาล', phonetic: 'Rong phayaban', kana: 'ローンパヤバーン', meaning: '病院', breakdown: [] },
  { id: 804, category: '場所', thai: 'โรงแรม', phonetic: 'Rong raem', kana: 'ローンレーム', meaning: 'ホテル', breakdown: [] },
  { id: 805, category: '場所', thai: 'สนามบิน', phonetic: 'Sanam bin', kana: 'サナームビン', meaning: '空港', breakdown: [] },
  { id: 806, category: '場所', thai: 'สถานี', phonetic: 'Sathani', kana: 'サターニー', meaning: '駅', breakdown: [] },
  { id: 807, category: '場所', thai: 'ตลาด', phonetic: 'Talat', kana: 'タラート', meaning: '市場', breakdown: [] },
  { id: 808, category: '場所', thai: 'ห้าง', phonetic: 'Hang', kana: 'ハーン', meaning: 'デパート', breakdown: [] },
  { id: 809, category: '場所', thai: 'บ้าน', phonetic: 'Ban', kana: 'バーン', meaning: '家', breakdown: [] },
  { id: 810, category: '場所', thai: 'โรงเรียน', phonetic: 'Rong rian', kana: 'ローンリアン', meaning: '学校', breakdown: [] },
  { id: 811, category: '場所', thai: 'วัด', phonetic: 'Wat', kana: 'ワット', meaning: 'お寺', breakdown: [] },
  { id: 812, category: '場所', thai: 'ทะเล', phonetic: 'Talay', kana: 'タレー', meaning: '海', breakdown: [] },
  { id: 813, category: '場所', thai: 'ภูเขา', phonetic: 'Poo khao', kana: 'プーカオ', meaning: '山', breakdown: [] },
  { id: 814, category: '場所', thai: 'กรุงเทพฯ', phonetic: 'Krung Thep', kana: 'クルンテープ', meaning: 'バンコク', breakdown: [] },
  { id: 815, category: '場所', thai: 'ญี่ปุ่น', phonetic: 'Yipun', kana: 'イープン', meaning: '日本', breakdown: [] },
  { id: 816, category: '場所', thai: 'ธนาคาร', phonetic: 'Thanakhan', kana: 'タナーカーン', meaning: '銀行', breakdown: [] },
  { id: 817, category: '場所', thai: 'ไปรษณีย์', phonetic: 'Praisanee', kana: 'プライサニー', meaning: '郵便局', breakdown: [] },
  { id: 818, category: '場所', thai: 'ร้านขายยา', phonetic: 'Ran khai ya', kana: 'ラーンカーイヤ', meaning: '薬局', breakdown: [] },
  { id: 819, category: '場所', thai: 'เซเว่น', phonetic: 'Seven', kana: 'セウェン', meaning: 'セブン', breakdown: [] },
  { id: 820, category: '場所', thai: 'ห้อง', phonetic: 'Hong', kana: 'ホーン', meaning: '部屋', breakdown: [] },
  { id: 821, category: '場所', thai: 'ที่นี่', phonetic: 'Tee nee', kana: 'ティーニー', meaning: 'ここ', breakdown: [] },
  { id: 822, category: '場所', thai: 'ที่นั่น', phonetic: 'Tee nan', kana: 'ティーナン', meaning: 'そこ', breakdown: [] },
  { id: 823, category: '場所', thai: 'ที่โน่น', phonetic: 'Tee non', kana: 'ティーノーン', meaning: 'あそこ', breakdown: [] },
  { id: 824, category: '場所', thai: 'ข้างใน', phonetic: 'Khang nai', kana: 'カーンナイ', meaning: '中', breakdown: [] },
  { id: 825, category: '場所', thai: 'ข้างนอก', phonetic: 'Khang nok', kana: 'カーンノック', meaning: '外', breakdown: [] },

  // --- 緊急・トラブル ---
  { id: 850, category: '緊急', thai: 'ช่วยด้วย', phonetic: 'Chuay duay', kana: 'チュアイドゥアイ！', meaning: '助けて！', breakdown: [] },
  { id: 851, category: '緊急', thai: 'หมอ', phonetic: 'Moo', kana: 'モー', meaning: '医者', breakdown: [] },
  { id: 852, category: '緊急', thai: 'ตำรวจ', phonetic: 'Tam ruat', kana: 'タムルアット', meaning: '警察', breakdown: [] },
  { id: 853, category: '緊急', thai: 'ไฟไหม้', phonetic: 'Fai mai', kana: 'ファイマイ', meaning: '火事', breakdown: [] },
  { id: 854, category: '緊急', thai: 'เจ็บ', phonetic: 'Jep', kana: 'ジェップ', meaning: '痛い', breakdown: [] },
  { id: 855, category: '緊急', thai: 'ป่วย', phonetic: 'Puay', kana: 'プアイ', meaning: '病気', breakdown: [] },
  { id: 856, category: '緊急', thai: 'ยา', phonetic: 'Ya', kana: 'ヤー', meaning: '薬', breakdown: [] },
  { id: 857, category: '緊急', thai: 'อันตราย', phonetic: 'Antarai', kana: 'アンタラーイ', meaning: '危ない', breakdown: [] },
  { id: 858, category: '緊急', thai: 'ระวัง', phonetic: 'Rawang', kana: 'ラワン', meaning: '気をつけて', breakdown: [] },
  { id: 859, category: '緊急', thai: 'หาย', phonetic: 'Hai', kana: 'ハーイ', meaning: '無くした', breakdown: [] },
  { id: 860, category: '緊急', thai: 'ขโมย', phonetic: 'Khamooi', kana: 'カモーイ', meaning: '泥棒', breakdown: [] },
  { id: 861, category: '緊急', thai: 'หยุด', phonetic: 'Yut', kana: 'ユット', meaning: '止まれ', breakdown: [] },
  { id: 862, category: '緊急', thai: 'หลงทาง', phonetic: 'Long thang', kana: 'ロンターン', meaning: '迷子', breakdown: [] },

  // --- マインド・その他 ---
  { id: 901, category: '動物', thai: 'หมา', phonetic: 'Ma', kana: 'マー', meaning: '犬', breakdown: [] },
  { id: 902, category: '動物', thai: 'แมว', phonetic: 'Maew', kana: 'メーオ', meaning: '猫', breakdown: [] },
  { id: 903, category: '動物', thai: 'ช้าง', phonetic: 'Chang', kana: 'チャーン', meaning: '象', breakdown: [] },
  { id: 904, category: '動物', thai: 'นก', phonetic: 'Nok', kana: 'ノック', meaning: '鳥', breakdown: [] },
  { id: 905, category: '動物', thai: 'ยุง', phonetic: 'Yung', kana: 'ユン', meaning: '蚊', breakdown: [] },
  { id: 906, category: '体', thai: 'หัว', phonetic: 'Hua', kana: 'フア', meaning: '頭', breakdown: [] },
  { id: 907, category: '体', thai: 'ตา', phonetic: 'Ta', kana: 'ター', meaning: '目', breakdown: [] },
  { id: 908, category: '体', thai: 'หู', phonetic: 'Hoo', kana: 'フー', meaning: '耳', breakdown: [] },
  { id: 909, category: '体', thai: 'จมูก', phonetic: 'Jamook', kana: 'ジャムーク', meaning: '鼻', breakdown: [] },
  { id: 910, category: '体', thai: 'ปาก', phonetic: 'Pak', kana: 'パーク', meaning: '口', breakdown: [] },
  { id: 911, category: '体', thai: 'มือ', phonetic: 'Mue', kana: 'ムー', meaning: '手', breakdown: [] },
  { id: 912, category: '体', thai: 'เท้า', phonetic: 'Thao', kana: 'タオ', meaning: '足', breakdown: [] },
  { id: 913, category: '体', thai: 'ขา', phonetic: 'Kha', kana: 'カー', meaning: '脚', breakdown: [] },
  { id: 914, category: '体', thai: 'ท้อง', phonetic: 'Tong', kana: 'トーン', meaning: 'お腹', breakdown: [] },
  { id: 915, category: '体', thai: 'ใจ', phonetic: 'Jai', kana: 'ジャイ', meaning: '心', breakdown: [] },
  { id: 916, category: 'モノ', thai: 'รถ', phonetic: 'Rot', kana: 'ロット', meaning: '車', breakdown: [] },
  { id: 917, category: 'モノ', thai: 'รถไฟ', phonetic: 'Rot fai', kana: 'ロットファイ', meaning: '電車', breakdown: [] },
  { id: 918, category: 'モノ', thai: 'เครื่องบิน', phonetic: 'Krueang bin', kana: 'クルアンビン', meaning: '飛行機', breakdown: [] },
  { id: 919, category: 'モノ', thai: 'โทรศัพท์', phonetic: 'Torasap', kana: 'トーラサップ', meaning: '電話', breakdown: [] },
  { id: 920, category: 'モノ', thai: 'หนังสือ', phonetic: 'Nang sue', kana: 'ナンスー', meaning: '本', breakdown: [] },
  { id: 921, category: 'マインド', thai: 'ไม่เป็นไร', phonetic: 'Mai pen rai', kana: 'マイペンライ', meaning: '気にしない', breakdown: [] },
  { id: 922, category: 'マインド', thai: 'เกรงใจ', phonetic: 'Kreng jai', kana: 'グレンジャイ', meaning: '遠慮する', breakdown: [] },
  { id: 923, category: 'マインド', thai: 'ใจเย็น', phonetic: 'Jai yen', kana: 'ジャイイェン', meaning: '落ち着いて', breakdown: [] },
  { id: 924, category: 'マインド', thai: 'เข้าใจแล้ว', phonetic: 'Khao jai laew', kana: 'カオジャイレウ', meaning: '分かりました', breakdown: [] },
  { id: 925, category: 'マインド', thai: 'ไม่รู้', phonetic: 'Mai roo', kana: 'マイルー', meaning: '知りません', breakdown: [] },
  { id: 926, category: 'マインド', thai: 'ลืมแล้ว', phonetic: 'Luem laew', kana: 'ルームレウ', meaning: '忘れました', breakdown: [] },
  { id: 927, category: 'マインド', thai: 'น่าสนใจ', phonetic: 'Na son jai', kana: 'ナーソンジャイ', meaning: '面白い', breakdown: [] },
  { id: 928, category: 'マインド', thai: 'โกรธ', phonetic: 'Krot', kana: 'グロート', meaning: '怒る', breakdown: [] },
  { id: 929, category: 'マインド', thai: 'อาย', phonetic: 'Ai', kana: 'アーイ', meaning: '恥ずかしい', breakdown: [] },
  { id: 930, category: 'マインド', thai: 'กลัว', phonetic: 'Klua', kana: 'グルア', meaning: '怖い', breakdown: [] }
];

// 会話フレーズデータ（50問）
const CONVERSATION_DATA = [
  // --- 挨拶・自己紹介 (1-5) ---
  {
    id: 1, category: '挨拶', title: '初対面の挨拶',
    dialogue: [
      { speaker: 'A', thai: 'สวัสดีครับ ชื่ออะไรครับ', phonetic: 'Sawasdee khrap, chue arai khrap?', meaning: 'こんにちは、お名前は何ですか？' },
      { speaker: 'B', thai: 'สวัสดีค่ะ ชื่อทานากะค่ะ', phonetic: 'Sawasdee kha, chue Tanaka kha', meaning: 'こんにちは、田中です。' }
    ]
  },
  {
    id: 2, category: '挨拶', title: '出身地を聞く',
    dialogue: [
      { speaker: 'A', thai: 'คุณมาจากไหนครับ', phonetic: 'Khun ma jak nai khrap?', meaning: 'どこから来ましたか？' },
      { speaker: 'B', thai: 'มาจากญี่ปุ่นค่ะ', phonetic: 'Ma jak Yipun kha', meaning: '日本から来ました。' }
    ]
  },
  {
    id: 3, category: '挨拶', title: '元気ですか？',
    dialogue: [
      { speaker: 'A', thai: 'สบายดีไหมครับ', phonetic: 'Sabai dee mai khrap?', meaning: 'お元気ですか？' },
      { speaker: 'B', thai: 'สบายดีค่ะ ขอบคุณค่ะ', phonetic: 'Sabai dee kha, khop khun kha', meaning: '元気です、ありがとう。' }
    ]
  },
  {
    id: 4, category: '挨拶', title: '久しぶり',
    dialogue: [
      { speaker: 'A', thai: 'ไม่ได้เจอกันนานเลยนะ', phonetic: 'Mai dai joe gan nan loei na', meaning: '久しぶりだね。' },
      { speaker: 'B', thai: 'นั่นสิ สบายดีไหม', phonetic: 'Nan si, sabai dee mai?', meaning: 'そうだね、元気？' }
    ]
  },
  {
    id: 5, category: '挨拶', title: '別れ際',
    dialogue: [
      { speaker: 'A', thai: 'ต้องไปแล้วครับ', phonetic: 'Tong pai laew khrap', meaning: 'もう行かなくちゃ。' },
      { speaker: 'B', thai: 'เดินทางปลอดภัยนะคะ', phonetic: 'Doen thang plot phai na kha', meaning: '気をつけてね（安全な旅を）。' }
    ]
  },

  // --- タクシー・移動 (6-13) ---
  {
    id: 6, category: '移動', title: '行き先を告げる',
    dialogue: [
      { speaker: 'A', thai: 'ไปสุขุมวิทซอย 3 ครับ', phonetic: 'Pai Sukhumvit Soi 3 khrap', meaning: 'スクンビットのソイ3に行ってください。' },
      { speaker: 'B', thai: 'ได้ครับ ขึ้นมาเลย', phonetic: 'Dai khrap, khuen ma loei', meaning: 'いいですよ、乗ってください。' }
    ]
  },
  {
    id: 7, category: '移動', title: 'メーターを使う',
    dialogue: [
      { speaker: 'A', thai: 'ใช้มิเตอร์ไหมครับ', phonetic: 'Chai meter mai khrap?', meaning: 'メーターを使ってくれますか？' },
      { speaker: 'B', thai: 'ใช้ครับ', phonetic: 'Chai khrap', meaning: '使いますよ。' }
    ]
  },
  {
    id: 8, category: '移動', title: 'ここで降ります',
    dialogue: [
      { speaker: 'A', thai: 'จอดที่นี่ครับ', phonetic: 'Jot tee nee khrap', meaning: 'ここで停めてください。' },
      { speaker: 'B', thai: 'ครับผม', phonetic: 'Khrap phom', meaning: 'はい、分かりました。' }
    ]
  },
  {
    id: 9, category: '移動', title: '右折・左折',
    dialogue: [
      { speaker: 'A', thai: 'เลี้ยวซ้ายข้างหน้าครับ', phonetic: 'Lieaw sai khang na khrap', meaning: 'この先を左に曲がってください。' },
      { speaker: 'B', thai: 'เลี้ยวขวาใช่ไหม', phonetic: 'Lieaw khwa chai mai?', meaning: '右折ですか？' },
      { speaker: 'A', thai: 'ไม่ใช่ครับ เลี้ยวซ้าย', phonetic: 'Mai chai khrap, lieaw sai', meaning: 'いいえ、左折です。' }
    ]
  },
  {
    id: 10, category: '移動', title: 'まっすぐ',
    dialogue: [
      { speaker: 'A', thai: 'ตรงไปเรื่อยๆ ครับ', phonetic: 'Trong pai rueai rueai khrap', meaning: 'ずっとまっすぐ行ってください。' },
      { speaker: 'B', thai: 'ถึงแยกแล้วบอกนะ', phonetic: 'Tueng yaek laew bok na', meaning: '交差点に着いたら教えてね。' }
    ]
  },
  {
    id: 11, category: '移動', title: '急いでいます',
    dialogue: [
      { speaker: 'A', thai: 'รีบหน่อยได้ไหมครับ', phonetic: 'Reep noi dai mai khrap?', meaning: '少し急いでもらえますか？' },
      { speaker: 'B', thai: 'รถติดมากครับ', phonetic: 'Rot tit mak khrap', meaning: '渋滞がひどいんですよ。' }
    ]
  },
  {
    id: 12, category: '移動', title: '料金を聞く',
    dialogue: [
      { speaker: 'A', thai: 'เท่าไหร่ครับ', phonetic: 'Thao rai khrap?', meaning: 'いくらですか？' },
      { speaker: 'B', thai: 'หนึ่งร้อยยี่สิบบาท', phonetic: 'Nueng roi yee sip baht', meaning: '120バーツです。' }
    ]
  },
  {
    id: 13, category: '移動', title: 'お釣りは結構です',
    dialogue: [
      { speaker: 'A', thai: 'ไม่ต้องทอนครับ', phonetic: 'Mai tong thon khrap', meaning: 'お釣りはいりません。' },
      { speaker: 'B', thai: 'ขอบคุณครับ', phonetic: 'Khop khun khrap', meaning: 'ありがとうございます。' }
    ]
  },

  // --- 買い物 (14-21) ---
  {
    id: 14, category: '買い物', title: '値段を聞く',
    dialogue: [
      { speaker: 'A', thai: 'อันนี้เท่าไหร่คะ', phonetic: 'An nee thao rai kha?', meaning: 'これはいくらですか？' },
      { speaker: 'B', thai: 'สามร้อยบาทครับ', phonetic: 'Sam roi baht khrap', meaning: '300バーツです。' }
    ]
  },
  {
    id: 15, category: '買い物', title: '値下げ交渉',
    dialogue: [
      { speaker: 'A', thai: 'แพงไป ลดได้ไหม', phonetic: 'Paeng pai, lot dai mai?', meaning: '高すぎます。まけてくれませんか？' },
      { speaker: 'B', thai: 'ได้นิดหน่อยครับ', phonetic: 'Dai nit noi khrap', meaning: '少しならいいですよ。' }
    ]
  },
  {
    id: 16, category: '買い物', title: '試着',
    dialogue: [
      { speaker: 'A', thai: 'ลองใส่ได้ไหมคะ', phonetic: 'Long sai dai mai kha?', meaning: '試着してもいいですか？' },
      { speaker: 'B', thai: 'ได้ครับ ห้องลองอยู่ทางโน้น', phonetic: 'Dai khrap, hong long yoo thang non', meaning: 'いいですよ、試着室はあちらです。' }
    ]
  },
  {
    id: 17, category: '買い物', title: 'サイズ違い',
    dialogue: [
      { speaker: 'A', thai: 'มีใหญ่กว่านี้ไหม', phonetic: 'Mee yai kwa nee mai?', meaning: 'これより大きいのはありますか？' },
      { speaker: 'B', thai: 'หมดแล้วครับ', phonetic: 'Mot laew khrap', meaning: '売り切れました。' }
    ]
  },
  {
    id: 18, category: '買い物', title: '色違い',
    dialogue: [
      { speaker: 'A', thai: 'มีสีอื่นไหมคะ', phonetic: 'Mee see uen mai kha?', meaning: '他の色はありますか？' },
      { speaker: 'B', thai: 'มีสีแดงกับสีดำครับ', phonetic: 'Mee see daeng kap see dam khrap', meaning: '赤と黒があります。' }
    ]
  },
  {
    id: 19, category: '買い物', title: 'これをください',
    dialogue: [
      { speaker: 'A', thai: 'เอาอันนี้ค่ะ', phonetic: 'Ao an nee kha', meaning: 'これをください。' },
      { speaker: 'B', thai: 'ใส่ถุงไหมครับ', phonetic: 'Sai thung mai khrap?', meaning: '袋に入れますか？' }
    ]
  },
  {
    id: 20, category: '買い物', title: 'カード払い',
    dialogue: [
      { speaker: 'A', thai: 'รับบัตรเครดิตไหมคะ', phonetic: 'Rap bat credit mai kha?', meaning: 'クレジットカードは使えますか？' },
      { speaker: 'B', thai: 'รับครับ', phonetic: 'Rap khrap', meaning: '使えますよ。' }
    ]
  },
  {
    id: 21, category: '買い物', title: 'ただ見ているだけ',
    dialogue: [
      { speaker: 'A', thai: 'มีอะไรให้ช่วยไหมครับ', phonetic: 'Mee arai hai chuay mai khrap?', meaning: '何かお手伝いしましょうか？' },
      { speaker: 'B', thai: 'ขอดูก่อนค่ะ', phonetic: 'Kho doo kon kha', meaning: 'ちょっと見ているだけです。' }
    ]
  },

  // --- 食事 (22-29) ---
  {
    id: 22, category: '食事', title: '注文する',
    dialogue: [
      { speaker: 'A', thai: 'ขอเมนูหน่อยครับ', phonetic: 'Kho menu noi khrap', meaning: 'メニューをください。' },
      { speaker: 'B', thai: 'นี่ครับ', phonetic: 'Nee khrap', meaning: 'どうぞ。' }
    ]
  },
  {
    id: 23, category: '食事', title: 'おすすめを聞く',
    dialogue: [
      { speaker: 'A', thai: 'มีอะไรแนะนำไหม', phonetic: 'Mee arai naenam mai?', meaning: 'おすすめはありますか？' },
      { speaker: 'B', thai: 'ต้มยำกุ้งอร่อยนะครับ', phonetic: 'Tom Yam Kung aroi na khrap', meaning: 'トムヤムクンが美味しいですよ。' }
    ]
  },
  {
    id: 24, category: '食事', title: '辛さの調整',
    dialogue: [
      { speaker: 'A', thai: 'ไม่เผ็ดนะครับ', phonetic: 'Mai phet na khrap', meaning: '辛くしないでください。' },
      { speaker: 'B', thai: 'ได้ครับ ไม่ใส่พริกนะ', phonetic: 'Dai khrap, mai sai prik na', meaning: '分かりました、唐辛子なしですね。' }
    ]
  },
  {
    id: 25, category: '食事', title: 'パクチー',
    dialogue: [
      { speaker: 'A', thai: 'ไม่ใส่ผักชีนะคะ', phonetic: 'Mai sai pak chi na kha', meaning: 'パクチーを入れないでください。' },
      { speaker: 'B', thai: 'ได้ค่ะ', phonetic: 'Dai kha', meaning: 'はい、承知しました。' }
    ]
  },
  {
    id: 26, category: '食事', title: 'お水',
    dialogue: [
      { speaker: 'A', thai: 'ขอน้ำเปล่าหนึ่งขวด', phonetic: 'Kho nam plao nueng khuat', meaning: 'お水を1本ください。' },
      { speaker: 'B', thai: 'เอาน้ำแข็งไหมครับ', phonetic: 'Ao nam khaeng mai khrap?', meaning: '氷は要りますか？' }
    ]
  },
  {
    id: 27, category: '食事', title: '美味しい？',
    dialogue: [
      { speaker: 'A', thai: 'อร่อยไหม', phonetic: 'Aroi mai?', meaning: '美味しい？' },
      { speaker: 'B', thai: 'อร่อยมาก', phonetic: 'Aroi mak', meaning: 'すごく美味しい！' }
    ]
  },
  {
    id: 28, category: '食事', title: 'お会計',
    dialogue: [
      { speaker: 'A', thai: 'เช็คบิลด้วยครับ', phonetic: 'Check bin duay khrap', meaning: 'お会計をお願いします。' },
      { speaker: 'B', thai: 'รอสักครู่ครับ', phonetic: 'Ro sak khru khrap', meaning: '少々お待ちください。' }
    ]
  },
  {
    id: 29, category: '食事', title: '持ち帰り',
    dialogue: [
      { speaker: 'A', thai: 'ใส่ถุงได้ไหม', phonetic: 'Sai thung dai mai?', meaning: '持ち帰り用に袋に入れてもらえますか？' },
      { speaker: 'B', thai: 'ได้ครับ', phonetic: 'Dai khrap', meaning: 'はい、できますよ。' }
    ]
  },

  // --- ホテル・生活 (30-36) ---
  {
    id: 30, category: 'ホテル', title: 'チェックイン',
    dialogue: [
      { speaker: 'A', thai: 'เช็คอินครับ', phonetic: 'Check in khrap', meaning: 'チェックインをお願いします。' },
      { speaker: 'B', thai: 'ขอพาสปอร์ตด้วยค่ะ', phonetic: 'Kho passport duay kha', meaning: 'パスポートをお願いします。' }
    ]
  },
  {
    id: 31, category: 'ホテル', title: 'Wi-Fi',
    dialogue: [
      { speaker: 'A', thai: 'รหัสไวไฟคืออะไรครับ', phonetic: 'Rahat Wi-Fi khue arai khrap?', meaning: 'Wi-Fiのパスワードは何ですか？' },
      { speaker: 'B', thai: 'อยู่ในคีย์การ์ดค่ะ', phonetic: 'Yoo nai key card kha', meaning: 'キーカードに書いてあります。' }
    ]
  },
  {
    id: 32, category: 'ホテル', title: 'トラブル（エアコン）',
    dialogue: [
      { speaker: 'A', thai: 'แอร์ไม่เย็นเลย', phonetic: 'Air mai yen loei', meaning: 'エアコンが全然涼しくありません。' },
      { speaker: 'B', thai: 'เดี๋ยวส่งช่างไปดูให้ครับ', phonetic: 'Diao song chang pai doo hai khrap', meaning: 'すぐに修理工を行かせます。' }
    ]
  },
  {
    id: 33, category: 'ホテル', title: '朝食の時間',
    dialogue: [
      { speaker: 'A', thai: 'อาหารเช้าเริ่มกี่โมงครับ', phonetic: 'Ahan chao roem kee mong khrap?', meaning: '朝食は何時からですか？' },
      { speaker: 'B', thai: 'เริ่มหกโมงเช้าค่ะ', phonetic: 'Roem hok mong chao kha', meaning: '朝6時から始まります。' }
    ]
  },
  {
    id: 34, category: '生活', title: 'トイレの場所',
    dialogue: [
      { speaker: 'A', thai: 'ห้องน้ำอยู่ที่ไหนครับ', phonetic: 'Hong nam yoo tee nai khrap?', meaning: 'トイレはどこですか？' },
      { speaker: 'B', thai: 'อยู่ทางขวาค่ะ', phonetic: 'Yoo thang khwa kha', meaning: '右側にあります。' }
    ]
  },
  {
    id: 35, category: '生活', title: '写真を撮る',
    dialogue: [
      { speaker: 'A', thai: 'ช่วยถ่ายรูปให้หน่อยได้ไหมครับ', phonetic: 'Chuay thai roop hai noi dai mai khrap?', meaning: '写真を撮ってもらえませんか？' },
      { speaker: 'B', thai: 'ได้ครับ หนึ่ง สอง สาม', phonetic: 'Dai khrap, nueng song sam', meaning: 'いいですよ。いち、に、さん！' }
    ]
  },
  {
    id: 36, category: '生活', title: '両替',
    dialogue: [
      { speaker: 'A', thai: 'แลกเงินที่ไหนได้บ้าง', phonetic: 'Laek ngoen tee nai dai bang?', meaning: 'どこでお金を両替できますか？' },
      { speaker: 'B', thai: 'มีธนาคารตรงโน้นครับ', phonetic: 'Mee thanakhan trong non khrap', meaning: 'あそこに銀行がありますよ。' }
    ]
  },

  // --- 日常会話・その他 (37-50) ---
  {
    id: 37, category: '日常', title: '天気',
    dialogue: [
      { speaker: 'A', thai: 'วันนี้ร้อนมากเลย', phonetic: 'Wan nee ron mak loei', meaning: '今日はとても暑いね。' },
      { speaker: 'B', thai: 'ไม่อยากออกไปข้างนอกเลย', phonetic: 'Mai yak ook pai khang nok loei', meaning: '外に出たくないよ。' }
    ]
  },
  {
    id: 38, category: '日常', title: '雨',
    dialogue: [
      { speaker: 'A', thai: 'ฝนตกแล้ว', phonetic: 'Fon tok laew', meaning: '雨が降ってきた。' },
      { speaker: 'B', thai: 'มีร่มไหม', phonetic: 'Mee rom mai?', meaning: '傘持ってる？' }
    ]
  },
  {
    id: 39, category: '日常', title: '仕事',
    dialogue: [
      { speaker: 'A', thai: 'ทำงานอะไรครับ', phonetic: 'Tam ngan arai khrap?', meaning: 'お仕事は何ですか？' },
      { speaker: 'B', thai: 'เป็นพนักงานบริษัทค่ะ', phonetic: 'Pen phanakngan borisat kha', meaning: '会社員です。' }
    ]
  },
  {
    id: 40, category: '日常', title: '趣味',
    dialogue: [
      { speaker: 'A', thai: 'ชอบทำอะไรเวลาว่าง', phonetic: 'Chop tam arai wela wang?', meaning: '暇な時は何をするのが好き？' },
      { speaker: 'B', thai: 'ชอบดูหนังค่ะ', phonetic: 'Chop doo nang kha', meaning: '映画を見るのが好きです。' }
    ]
  },
  {
    id: 41, category: '日常', title: '電話番号',
    dialogue: [
      { speaker: 'A', thai: 'ขอเบอร์โทรศัพท์ได้ไหม', phonetic: 'Kho boe torasap dai mai?', meaning: '電話番号を教えてもらえますか？' },
      { speaker: 'B', thai: 'ได้ค่ะ 081...', phonetic: 'Dai kha, soon paet nueng...', meaning: 'いいですよ、081...' }
    ]
  },
  {
    id: 42, category: '日常', title: '理解できた？',
    dialogue: [
      { speaker: 'A', thai: 'เข้าใจไหมครับ', phonetic: 'Khao jai mai khrap?', meaning: '分かりましたか？' },
      { speaker: 'B', thai: 'เข้าใจแล้วค่ะ', phonetic: 'Khao jai laew kha', meaning: '分かりました。' }
    ]
  },
  {
    id: 43, category: '日常', title: '分からない',
    dialogue: [
      { speaker: 'A', thai: 'พูดภาษาไทยได้ไหม', phonetic: 'Poot pasa Thai dai mai?', meaning: 'タイ語を話せますか？' },
      { speaker: 'B', thai: 'ได้นิดหน่อยค่ะ', phonetic: 'Dai nit noi kha', meaning: '少しだけ話せます。' }
    ]
  },
  {
    id: 44, category: '日常', title: 'ゆっくり話して',
    dialogue: [
      { speaker: 'A', thai: 'ช่วยพูดช้าๆ หน่อยได้ไหม', phonetic: 'Chuay poot cha cha noi dai mai?', meaning: 'もう少しゆっくり話してもらえますか？' },
      { speaker: 'B', thai: 'ได้ครับ', phonetic: 'Dai khrap', meaning: 'いいですよ。' }
    ]
  },
  {
    id: 45, category: '日常', title: '何時？',
    dialogue: [
      { speaker: 'A', thai: 'กี่โมงแล้ว', phonetic: 'Kee mong laew?', meaning: '今何時？' },
      { speaker: 'B', thai: 'บ่ายสองโมง', phonetic: 'Bai song mong', meaning: '午後2時だよ。' }
    ]
  },
  {
    id: 46, category: '日常', title: 'お腹すいた',
    dialogue: [
      { speaker: 'A', thai: 'หิวข้าวแล้ว', phonetic: 'Hiw khao laew', meaning: 'お腹すいたー。' },
      { speaker: 'B', thai: 'ไปกินข้าวกันไหม', phonetic: 'Pai kin khao gan mai?', meaning: 'ご飯食べに行こうか？' }
    ]
  },
  {
    id: 47, category: '日常', title: '疲れた',
    dialogue: [
      { speaker: 'A', thai: 'เหนื่อยไหม', phonetic: 'Nueai mai?', meaning: '疲れた？' },
      { speaker: 'B', thai: 'เหนื่อยมาก อยากกลับบ้าน', phonetic: 'Nueai mak, yak klap ban', meaning: 'すごく疲れた。家に帰りたい。' }
    ]
  },
  {
    id: 48, category: '日常', title: 'すごい！',
    dialogue: [
      { speaker: 'A', thai: 'คุณพูดไทยเก่งมาก', phonetic: 'Khun poot Thai keng mak', meaning: 'タイ語がすごく上手ですね！' },
      { speaker: 'B', thai: 'ไม่ขนาดนั้นหรอกครับ', phonetic: 'Mai khanat nan rok khrap', meaning: 'それほどでもないですよ。' }
    ]
  },
  {
    id: 49, category: '日常', title: '手伝って',
    dialogue: [
      { speaker: 'A', thai: 'ช่วยหน่อยได้ไหม', phonetic: 'Chuay noi dai mai?', meaning: 'ちょっと手伝ってくれる？' },
      { speaker: 'B', thai: 'ได้ มีอะไรเหรอ', phonetic: 'Dai, mee arai ror?', meaning: 'いいよ、どうしたの？' }
    ]
  },
  {
    id: 50, category: '日常', title: '大丈夫',
    dialogue: [
      { speaker: 'A', thai: 'ขอโทษที่มาช้านะ', phonetic: 'Kho thot tee ma cha na', meaning: '遅れてごめんね。' },
      { speaker: 'B', thai: 'ไม่เป็นไร', phonetic: 'Mai pen rai', meaning: '大丈夫だよ。' }
    ]
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState('home'); 
  const [targetTab, setTargetTab] = useState(null); 
  const [selectedCategory, setSelectedCategory] = useState('すべて');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- ブックマーク機能 (LocalStorage) ---
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('kengThaiBookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('kengThaiBookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (id) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  // --- 進捗保存機能 (LocalStorage) ---
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('kengThaiProgress');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // 進捗が更新されたら保存
  useEffect(() => {
    localStorage.setItem('kengThaiProgress', JSON.stringify(progress));
  }, [progress]);

  const updateProgress = (category, index) => {
    setProgress(prev => ({
      ...prev,
      [category]: index
    }));
  };

  // --- 音声再生 ---
  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'th-TH';
      utterance.rate = 0.8; 
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleModeSelect = (mode) => {
    setTargetTab(mode);
    if (mode === 'conversation') {
      setCurrentTab('conversation_list');
    } else {
      // 会話モードから戻ったときにカテゴリ選択がおかしくならないようにリセット
      if (typeof selectedCategory === 'object') {
          setSelectedCategory('すべて');
      }
      setCurrentTab('category_select');
    }
  };

  // 検索からの直接遷移用関数
  const handleSearch = () => {
    setSelectedCategory('すべて');
    setCurrentTab('learn');
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentTab(targetTab);
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return <HomeMenu onSelectMode={handleModeSelect} searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} />;
      case 'category_select':
        return <CategorySelectMenu onSelectCategory={handleCategorySelect} onBack={() => setCurrentTab('home')} targetMode={targetTab} />;
      case 'learn':
        return <LearningMode 
          playAudio={playAudio} 
          onBack={() => setCurrentTab('home')} 
          category={selectedCategory} 
          progress={progress}
          updateProgress={updateProgress}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          bookmarks={bookmarks}
          toggleBookmark={toggleBookmark}
        />;
      case 'quiz':
        return <QuizMode playAudio={playAudio} onBack={() => setCurrentTab('home')} category={selectedCategory} />;
      case 'conversation_list':
        return <ConversationList 
          onBack={() => setCurrentTab('home')} 
          onSelectConversation={(conv) => { 
            setSelectedConversation(conv); 
            setCurrentTab('conversation_detail'); 
          }} 
        />;
      case 'conversation_detail':
        return <ConversationDetail 
          conversation={selectedConversation} 
          onBack={() => setCurrentTab('conversation_list')} 
          playAudio={playAudio} 
        />;
      default:
        return <HomeMenu onSelectMode={handleModeSelect} searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} />;
    }
  };

  return (
    <div className="h-screen bg-slate-50 text-slate-800 font-sans max-w-md mx-auto shadow-2xl overflow-hidden border-x border-slate-200 relative flex flex-col">
      <header className="bg-indigo-600 text-white p-4 shadow-md z-10 shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">
            Keng Thai
          </h1>
          {currentTab !== 'home' && (
            <button 
              onClick={() => setCurrentTab('home')}
              className="text-white/80 hover:text-white"
            >
              <Home size={20} />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        {renderContent()}
      </main>

      <nav className="absolute bottom-0 w-full bg-white border-t border-slate-200 flex justify-around p-2 pb-4 z-20">
        <NavButton 
          icon={<BookOpen size={24} />} 
          label="学習" 
          active={currentTab === 'learn'} 
          onClick={() => handleModeSelect('learn')} 
        />
        <NavButton 
          icon={<Brain size={24} />} 
          label="クイズ" 
          active={currentTab === 'quiz'} 
          onClick={() => handleModeSelect('quiz')} 
        />
        <NavButton 
          icon={<MessageCircle size={24} />} 
          label="会話" 
          active={currentTab === 'conversation_list' || currentTab === 'conversation_detail'} 
          onClick={() => handleModeSelect('conversation')} 
        />
      </nav>
    </div>
  );
}

const NavButton = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-colors ${active ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-400'}`}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const HomeMenu = ({ onSelectMode, searchTerm, setSearchTerm, onSearch }) => {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
        onSearch();
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg">
        <h2 className="text-lg font-bold mb-1">サワッディー！</h2>
        <p className="opacity-90 text-sm">今日はどのフレーズを覚えますか？</p>
      </div>

      {/* 検索バー */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          placeholder="単語を検索して学習..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 pl-12 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
        <Search className="absolute left-4 top-4 text-slate-400" size={24} />
      </form>

      <div className="grid grid-cols-1 gap-4">
        <MenuCard 
          title="学習モード" 
          desc="フレーズ学習" 
          icon={<BookOpen className="text-indigo-500" size={40} />}
          onClick={() => onSelectMode('learn')}
          color="bg-indigo-50"
          isLarge={true}
        />
        <MenuCard 
          title="クイズモード" 
          desc="4択問題で定着度をテスト" 
          icon={<Brain className="text-pink-500" size={40} />}
          onClick={() => onSelectMode('quiz')}
          color="bg-pink-50"
          isLarge={true}
        />
        <MenuCard 
          title="会話モード" 
          desc="実践的な会話フレーズ" 
          icon={<MessageCircle className="text-green-500" size={40} />}
          onClick={() => onSelectMode('conversation')}
          color="bg-green-50"
          isLarge={true}
        />
      </div>
    </div>
  );
};

const MenuCard = ({ title, desc, icon, onClick, color, isLarge }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-5 ${isLarge ? 'p-8' : 'p-4'} rounded-2xl transition-all hover:scale-[1.02] active:scale-95 text-left border border-slate-100 shadow-md ${color}`}
  >
    <div className="bg-white p-4 rounded-full shadow-sm">
      {icon}
    </div>
    <div>
      <h3 className={`${isLarge ? 'text-xl' : 'font-bold'} font-bold text-slate-800 mb-1`}>{title}</h3>
      <p className={`${isLarge ? 'text-sm' : 'text-xs'} text-slate-500`}>{desc}</p>
    </div>
    <ChevronRight className="ml-auto text-slate-300" size={isLarge ? 28 : 24}/>
  </button>
);

const CategorySelectMenu = ({ onSelectCategory, onBack, targetMode }) => {
  const categories = ['すべて', ...new Set(PHRASE_DATA.map(item => item.category))];
  
  return (
    <div className="p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-sm font-bold">
          <ChevronLeft size={20} /> 戻る
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">カテゴリを選択</h2>
        <p className="text-slate-500 text-sm">
          {targetMode === 'learn' ? '学習したい' : 'テストしたい'}トピックを選んでください
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-8">
        {/* ブックマーク（苦手）ボタンを追加 */}
        {targetMode === 'learn' && (
          <button
            onClick={() => onSelectCategory('★苦手')}
            className="p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02] active:scale-95 flex flex-col justify-between h-24 shadow-sm bg-yellow-50 border-yellow-200 text-yellow-800 col-span-2"
          >
            <span className="font-bold text-lg flex items-center gap-2"><Star size={20} fill="currentColor" /> 苦手リスト</span>
            <div className="flex justify-end">
              <ChevronRight size={16} className="text-yellow-400"/>
            </div>
          </button>
        )}

        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => onSelectCategory(cat)}
            className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02] active:scale-95 flex flex-col justify-between h-24 shadow-sm
              ${cat === 'すべて' 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-800 col-span-2' 
                : 'bg-white border-slate-100 text-slate-700 hover:border-indigo-100'
              }`}
          >
            <span className="font-bold text-lg">{cat}</span>
            <div className="flex justify-end">
              {cat === 'すべて' ? <Filter size={20} className="opacity-50"/> : <ChevronRight size={16} className="text-slate-300"/>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const LearningMode = ({ playAudio, onBack, category, progress, updateProgress, searchTerm, setSearchTerm, bookmarks, toggleBookmark }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [isListView, setIsListView] = useState(false);

  // フィルタリング
  const safeData = useMemo(() => {
    let data = PHRASE_DATA;
    
    // ブックマークフィルタ
    if (category === '★苦手') {
      data = data.filter(item => bookmarks.includes(item.id));
    } else if (category !== 'すべて') {
      data = data.filter(item => item.category === category);
    }

    // 検索フィルタ
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(item => 
        item.thai.includes(searchTerm) || 
        item.phonetic.toLowerCase().includes(lower) || 
        item.meaning.includes(searchTerm) ||
        item.kana.includes(searchTerm)
      );
    }
    return data;
  }, [category, searchTerm, bookmarks]);

  // 検索語句がある場合はリスト表示にする
  useEffect(() => {
    if (searchTerm) {
      setIsListView(true);
    } else {
      setIsListView(false);
    }
  }, [searchTerm]);

  // 現在のインデックス管理
  const [index, setIndex] = useState(0);

  // データが変わったらインデックスをリセット
  useEffect(() => {
    if (searchTerm || category === '★苦手') {
      setIndex(0);
    } else if (category !== 'すべて' && progress[category] !== undefined) {
      const savedIndex = progress[category];
      setIndex(savedIndex < safeData.length ? savedIndex : 0);
    } else {
      setIndex(0);
    }
    setShowDetail(false);
  }, [category, safeData.length]); // searchTerm依存を外してリスト表示切り替えのみに任せる

  const item = safeData[index];
  const isBookmarked = item ? bookmarks.includes(item.id) : false;

  const nextCard = () => {
    if (index < safeData.length - 1) {
      const newIndex = index + 1;
      setIndex(newIndex);
      setShowDetail(false);
      // 進捗保存（通常学習時のみ）
      if (category !== 'すべて' && category !== '★苦手' && !searchTerm) {
        updateProgress(category, newIndex);
      }
    }
  };
  const prevCard = () => {
    if (index > 0) {
      const newIndex = index - 1;
      setIndex(newIndex);
      setShowDetail(false);
      if (category !== 'すべて' && category !== '★苦手' && !searchTerm) {
        updateProgress(category, newIndex);
      }
    }
  };

  const handleListItemClick = (newIndex) => {
    setIndex(newIndex);
    setIsListView(false);
  };

  return (
    <div className="p-4 flex flex-col h-full">
      {/* 検索バー */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="日本語・タイ語・発音で検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
        <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="absolute right-3 top-3.5 text-slate-400">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-sm font-bold">
          <ChevronLeft size={20} /> ホーム
        </button>
        
        {/* 検索中はカテゴリーを表示しない */}
        {!isListView && !searchTerm && (
          <span className="text-sm text-slate-500 font-bold">
            {item ? `${category} (${index + 1}/${safeData.length})` : 'データなし'}
          </span>
        )}
        {searchTerm && isListView && (
           <span className="text-sm text-slate-500 font-bold">
             {safeData.length} 件ヒット
           </span>
        )}
        <div className="w-10"></div>
      </div>

      {isListView ? (
        // --- リスト表示モード ---
        <div className="flex-1 overflow-y-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-2">
          {safeData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <p>一致するフレーズが見つかりません。</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {safeData.map((item, i) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleListItemClick(i)}
                    className="w-full text-left p-3 hover:bg-slate-50 flex justify-between items-center transition-colors rounded-lg"
                  >
                    <div>
                      <p className="font-thai font-bold text-lg text-slate-800">{item.thai}</p>
                      <p className="text-xs text-slate-500">{item.meaning}</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        // --- カード表示モード ---
        <>
          {safeData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <p>データがありません。</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center mb-6 relative border border-slate-100 flex-grow">
                {/* リストに戻るボタン（検索中のみ） */}
                {searchTerm && (
                  <button 
                    onClick={() => setIsListView(true)}
                    className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <List size={24} />
                  </button>
                )}

                {/* ブックマークボタン */}
                <button 
                    onClick={() => toggleBookmark(item.id)}
                    className="absolute top-4 left-4 text-slate-300 hover:text-yellow-400 transition-colors p-2"
                    style={{ left: searchTerm ? '3.5rem' : '1rem' }} // 検索時はリストボタンと被らないようにずらす
                >
                    <Star size={28} fill={isBookmarked ? "#fbbf24" : "none"} className={isBookmarked ? "text-yellow-400" : ""} />
                </button>

                <button 
                  onClick={() => playAudio(item.thai)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-indigo-500 p-2 rounded-full bg-slate-50"
                >
                  <Volume2 size={24} />
                </button>

                <div className="mt-8 mb-6">
                  <h2 className="text-5xl font-thai font-bold text-slate-800 mb-4 leading-normal">{item.thai}</h2>
                  <p className="text-slate-400 font-mono text-sm mb-1">{item.phonetic}</p>
                  <p className="text-2xl font-bold text-indigo-600 mb-4">{item.kana}</p>
                  <p className="text-lg text-slate-700 font-medium">{item.meaning}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 w-full text-left mb-6 overflow-y-auto max-h-32">
                  <p>{item.description || '特記事項はありません'}</p>
                </div>

                <button 
                  onClick={() => setShowDetail(true)}
                  disabled={!item.breakdown || item.breakdown.length === 0}
                  className={`mt-auto w-full py-3 border-2 font-bold rounded-xl transition-colors flex items-center justify-center gap-2
                    ${!item.breakdown || item.breakdown.length === 0 
                      ? 'border-slate-100 text-slate-300 cursor-not-allowed' 
                      : 'border-indigo-100 text-indigo-600 hover:bg-indigo-50'}`}
                >
                  <Search size={18} />
                  {!item.breakdown || item.breakdown.length === 0 ? '分析データなし' : '文字・声調を分析'}
                </button>
              </div>

              <div className="flex gap-4 pb-4">
                <button onClick={prevCard} disabled={index === 0} className="flex-1 py-3 rounded-xl bg-slate-200 text-slate-500 font-bold disabled:opacity-50">戻る</button>
                <button onClick={nextCard} disabled={index === safeData.length - 1} className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold disabled:opacity-50">次へ</button>
              </div>
            </>
          )}
        </>
      )}

      {showDetail && item && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md h-[85vh] sm:h-auto rounded-t-2xl sm:rounded-2xl p-6 overflow-y-auto animate-slide-up">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Search size={20} className="text-indigo-500" />
                構造分析
              </h3>
              <button onClick={() => setShowDetail(false)}><X size={24} className="text-slate-400" /></button>
            </div>
            
            <div className="mb-8 text-center bg-slate-50 p-4 rounded-xl">
              <h2 className="text-4xl font-thai font-bold text-slate-800 mb-2">{item.thai}</h2>
              <p className="text-slate-500 text-sm">各文字の役割と声調ルール</p>
            </div>

            {item.breakdown && item.breakdown.length > 0 ? (
              <div className="space-y-4">
                {item.breakdown.map((char, i) => (
                  <div key={i} className="flex flex-col gap-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="flex items-start gap-4 p-3 bg-slate-50 border-b border-slate-100">
                      <div className="w-12 h-12 bg-white flex items-center justify-center text-2xl font-thai font-bold rounded-lg shadow-sm text-indigo-600 border border-indigo-100 flex-shrink-0">
                        {char.char}
                      </div>
                      <div>
                        {char.type === '音節' ? (
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">音節: {char.sound}</span>
                            <span className="text-xs text-slate-400">音の塊</span>
                          </div>
                        ) : (
                          <>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded ${char.class ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>
                                {char.class || char.type}
                              </span>
                              <span className="font-bold text-slate-800">{char.name}</span>
                            </div>
                            <p className="text-sm text-slate-500">
                              {char.meaning && `意味: ${char.meaning} / `} 
                              音: <span className="font-mono text-indigo-500">{char.sound}</span>
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    {char.toneRule && (
                      <div className="p-3 bg-yellow-50 text-xs text-yellow-900 border-t border-yellow-100 flex gap-2">
                        <Info size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block text-yellow-700 mb-1">声調ルールメモ:</span>
                          {char.toneRule}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : null}
            
            <button 
              onClick={() => setShowDetail(false)}
              className="w-full mt-6 bg-slate-800 text-white font-bold py-3 rounded-xl"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const QuizMode = ({ playAudio, onBack, category }) => {
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('playing'); // playing, result
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [options, setOptions] = useState([]);
  const [isRandom, setIsRandom] = useState(false); // ランダム出題スイッチ

  // フィルタリング
  const safeData = useMemo(() => {
    let data = category === 'すべて' 
      ? PHRASE_DATA 
      : PHRASE_DATA.filter(item => item.category === category);
    
    // ランダムの場合はシャッフル
    if (isRandom) {
       return [...data].sort(() => 0.5 - Math.random());
    }
    return data;
  }, [category, isRandom]); // isRandomが変わったら再計算

  useEffect(() => {
    setQIndex(0);
    setScore(0);
    setGameState('playing');
  }, [category, isRandom]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const currentItem = safeData[qIndex];
    if (!currentItem) return;

    const otherItems = PHRASE_DATA.filter(i => i.id !== currentItem.id);
    const shuffledOthers = [...otherItems].sort(() => 0.5 - Math.random()).slice(0, 3);
    const nextOptions = [currentItem, ...shuffledOthers].sort(() => 0.5 - Math.random());
    setOptions(nextOptions);
  }, [qIndex, gameState, safeData]);

  const handleAnswer = (option) => {
    if (selected) return;
    setSelected(option);
    const correct = option.id === safeData[qIndex].id;
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
      playAudio(safeData[qIndex].thai);
    }

    setTimeout(() => {
      if (qIndex < safeData.length - 1) {
        setQIndex(qIndex + 1);
        setSelected(null);
        setIsCorrect(null);
      } else {
        setGameState('result');
      }
    }, 1500);
  };

  if (gameState === 'result') {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full text-center">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
          <Brain size={48} className="text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">結果発表！</h2>
        <p className="text-sm text-slate-500 mb-2">{category}編</p>
        <p className="text-5xl font-black text-indigo-600 mb-6">{score} / {safeData.length}</p>
        <button onClick={onBack} className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl mb-4">メニューへ戻る</button>
        <button onClick={() => {setQIndex(0); setScore(0); setGameState('playing'); setSelected(null);}} className="w-full text-slate-500 font-bold py-4">もう一度</button>
      </div>
    );
  }

  const currentItem = safeData[qIndex];
  if (!currentItem) return <div>Data Error</div>;

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
            <button onClick={onBack} className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-sm font-bold">
            <ChevronLeft size={20} /> ホーム
            </button>
            <span className="text-xs font-bold bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">{category}</span>
        </div>
        
        {/* ランダム切り替えボタン */}
        <button 
            onClick={() => setIsRandom(!isRandom)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors ${isRandom ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
        >
            <Shuffle size={14} />
            {isRandom ? 'ランダム' : '順番'}
        </button>
      </div>

      <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
        <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${((qIndex + 1) / safeData.length) * 100}%` }}></div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8 mb-6 text-center relative overflow-hidden flex-grow flex flex-col justify-center">
        {selected && (
          <div className={`absolute inset-0 flex items-center justify-center bg-opacity-10 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
            {isCorrect ? <CheckCircle className="text-green-500 w-24 h-24 opacity-20" /> : <XCircle className="text-red-500 w-24 h-24 opacity-20" />}
          </div>
        )}
        <h2 className="text-5xl font-thai font-bold text-slate-800 mb-4 py-2">{currentItem.thai}</h2>
        <button onClick={() => playAudio(currentItem.thai)} className="mx-auto text-slate-400 hover:text-indigo-500"><Volume2 size={24} /></button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {options.map((opt, i) => {
          let style = "bg-white text-slate-700 border-2 border-slate-200";
          if (selected) {
            if (opt.id === currentItem.id) style = "bg-green-100 text-green-800 border-green-500";
            else if (opt === selected) style = "bg-red-100 text-red-800 border-red-500";
            else style = "opacity-50 border-slate-100";
          }
          return (
            <button 
              key={i} 
              onClick={() => handleAnswer(opt)} 
              disabled={!!selected}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-sm ${style}`}
            >
              {opt.meaning}
            </button>
          )
        })}
      </div>
    </div>
  );
};

// --- 会話一覧モード ---
const ConversationList = ({ onBack, onSelectConversation }) => {
  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-sm font-bold">
          <ChevronLeft size={20} /> ホーム
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">会話フレーズ</h2>
        <p className="text-slate-500 text-sm">実践的な会話の流れを学びましょう</p>
      </div>

      <div className="space-y-3">
        {CONVERSATION_DATA.map((conv, i) => (
          <button
            key={i}
            onClick={() => onSelectConversation(conv)}
            className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-indigo-200 transition-colors text-left"
          >
            <div>
              <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded mb-1 inline-block">
                {conv.category}
              </span>
              <h3 className="font-bold text-slate-800">{conv.title}</h3>
            </div>
            <ChevronRight className="text-slate-300" size={20} />
          </button>
        ))}
      </div>
    </div>
  );
};

// --- 会話詳細モード（チャットUI） ---
const ConversationDetail = ({ conversation, onBack, playAudio }) => {
  const [isPlayingAll, setIsPlayingAll] = useState(false);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-slate-400 hover:text-slate-600">
            <ChevronLeft size={24} />
          </button>
          <div>
            <span className="text-xs text-slate-400 font-bold block">{conversation.category}</span>
            <h3 className="font-bold text-slate-800">{conversation.title}</h3>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {conversation.dialogue.map((line, i) => (
          <div key={i} className={`flex ${line.speaker === 'B' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${line.speaker === 'B' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 shadow-sm
                ${line.speaker === 'A' ? 'bg-indigo-500' : 'bg-pink-500'}`}>
                {line.speaker}
              </div>

              <div className="flex flex-col gap-1">
                <div 
                  onClick={() => playAudio(line.thai)}
                  className={`p-4 rounded-2xl shadow-sm border cursor-pointer active:scale-95 transition-transform relative
                  ${line.speaker === 'B' 
                    ? 'bg-white border-pink-100 rounded-tr-none' 
                    : 'bg-white border-indigo-100 rounded-tl-none'}`}
                >
                  <p className="text-xl font-thai font-bold text-slate-800 mb-1">{line.thai}</p>
                  <p className="text-xs text-slate-400 font-mono mb-1">{line.phonetic}</p>
                  <p className="text-sm text-slate-600 border-t border-slate-100 pt-1 mt-1">{line.meaning}</p>
                  <Volume2 size={14} className="absolute top-2 right-2 text-slate-300" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};