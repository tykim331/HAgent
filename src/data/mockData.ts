import { Agent, Comment } from '../types';

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agent-1',
    name: '철강재 국외 선적 선복량 예측 에이전트',
    category: 'prediction',
    shortDesc: '과거 선적 트렌드와 글로벌 해운 데이터를 기반으로 향후 4주간 동남아 노선 선복 배정 한도 및 적정 운임을 예측합니다.',
    painPoint: '해운 동향 및 글로벌 선적 공간 확보 경쟁으로 급변하는 운임과 선적 공간을 사전에 파악하기 어려워 납기 지연 및 물류비 초과가 자주 발생합니다.',
    expectation: '선복 확보율 25% 향상, 선적 지연 클레임 15% 감소, 분기별 물류비용 예측 오차범위 5% 이내로 감소.',
    features: [
      '글로벌 주요 항만 적체 일수 분석 및 실시간 예측 연동',
      '상해컨테이너운임지수(SCFI) 동향 및 계절성 요인 가중치 적용',
      '주차별 예상 확보 가능 선복량 리포팅 및 선사별 배정 가이드라인'
    ],
    steps: [
      '에이전트 화면에서 선적 타겟 지역(예: 동남아/인도네시아)과 철강 제품군을 선택합니다.',
      '선적 예정일, 예정 물량(단위: M/T) 및 희망 컨테이너 규격을 입력합니다.',
      'AI가 최근 4개년 선적 통계와 현재 포트 혼잡도를 매칭하여 "선사별 선복 확보 성공률 점수"를 도출합니다.',
      '추천 선적 주차 및 선사 네고용 타겟 요율 가이드를 담은 PDF 브리핑 보고서를 생성합니다.'
    ],
    prompt: `import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor

def predict_shipping_capacity(port_data, scfi_index, historical_shipments):
    """
    동남아 노선 철강 선복량 및 적정 운임 예측 모델
    - SCFI(상해컨테이너운임지수) 트렌드 및 항만 정체 지수 활용
    """
    # 1. 특성 공학 (Feature Engineering)
    df = pd.merge(port_data, scfi_index, on='date')
    df['rolling_scfi'] = df['scfi'].rolling(window=4, min_periods=1).mean()
    df['port_congestion_index'] = df['waiting_ships'] / df['max_capacity']
    
    # 2. 독립변수 및 종속변수 정의
    features = ['rolling_scfi', 'port_congestion_index', 'historical_volume', 'seasonality_index']
    X = df[features]
    y_rate = df['freight_rate_per_teu']
    y_capacity = df['allocated_capacity']
    
    # 3. 모델 학습 및 예측
    model_rate = RandomForestRegressor(n_estimators=100, random_state=42)
    model_rate.fit(X, y_rate)
    
    model_capacity = RandomForestRegressor(n_estimators=100, random_state=42)
    model_capacity.fit(X, y_capacity)
    
    return {
        "predicted_rate_range": (model_rate.predict(X[-1:])[0] * 0.95, model_rate.predict(X[-1:])[0] * 1.05),
        "predicted_capacity_teu": int(model_capacity.predict(X[-1:])[0]),
        "congestion_risk": "High" if df['port_congestion_index'].iloc[-1] > 0.75 else "Stable"
    }`,
    creatorName: '김현우 과장',
    creatorDept: '철강1본부 수출영업팀',
    creatorContact: 'hw.kim@hyundaicorp.com / 사내 메신저: hw_steel',
    likes: 42,
    likedBy: ['emp-002', 'emp-003', 'emp-005', 'emp-010'],
    views: 312,
    badge: 'best_month',
    createdAt: '2026-06-15T09:00:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=400',
    emojiReactions: {
      '👍': ['emp-002', 'emp-004', 'emp-005', 'emp-009'],
      '🔥': ['emp-003', 'emp-008', 'emp-010'],
      '💡': ['emp-001', 'emp-006', 'emp-012'],
      '👏': ['emp-011', 'emp-014']
    }
  },
  {
    id: 'agent-2',
    name: '석유화학 원자재 계약서 조항 분석기',
    category: 'writing',
    shortDesc: '영문 원자재 구매 계약서에서 독소 조항, 손해배상 면책 범위, 상호 책임 규정을 즉시 파싱하여 법무 검토 전 1차 체크리스트를 자동 작성합니다.',
    painPoint: '해외 공급업체들이 제시하는 수십 페이지 분량의 영문 계약서 속 독소 조항(지체상금 면책, 불리한 관할 법원 등)을 실무 부서에서 빠르게 가려내지 못해 초기 법무 조율 시간이 오래 걸립니다.',
    expectation: '계약서 1차 검토 시간 80% 단축(평균 3시간 -> 25분), 중대한 리스크 조항 실무 누락률 0% 달성.',
    features: [
      '계약 당사자의 면책(Indemnity) 및 귀책 범위 추출',
      '지체상금(Liquidated Damages) 상한선 기준 초과 규정 자동 탐지',
      '국제 상업 분쟁 발생 시 관할법원(Jurisdiction) 및 준거법(Governing Law) 적정성 진단'
    ],
    steps: [
      '에이전트에 검토하려는 영문 석유화학 원자재 계약서 본문을 업로드하거나 복사-붙여넣기 합니다.',
      '수입 품목 및 협상 주도권을 기반으로 가이드라인 세기(엄격 검토 / 유연 검토)를 선택합니다.',
      '에이전트가 텍스트를 고속 분석하여 "요주의 조항", "불리한 중재 조항", "의무 사항"으로 나누어 출력합니다.',
      '제시된 리스크에 맞춰 공급업체에 보낼 대체 반박 문구(Alternative Clauses)를 다운받아 조율을 진행합니다.'
    ],
    prompt: `import os
from google import genai
from google.genai import types

def analyze_raw_material_contract(contract_text: str) -> dict:
    """
    영문 원자재 구매 계약서 독소 조항 분석 엔진
    - Google GenAI (Gemini 3.5 Flash) 기반 파싱 및 1차 스크리닝
    """
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    
    prompt = f"""
    당신은 현대코퍼레이션 법무 및 원자재 무역 계약 전문가입니다.
    다음 영문 석유화학 원자재 계약서를 엄격하게 분석하여 독소 조항 및 법적 리스크를 분석하십시오.
    
    [분석 대상 계약서]
    {{contract_text}}
    
    [주요 체크포인트]
    1. 책임 제한 한도(Limitation of Liability) 규정의 아군 독소 유무
    2. 지체상금(Liquidated Damages) 상한선 적정성 여부
    3. 불가항력(Force Majeure) 조항의 편향성 검토
    4. 준거법(Governing Law) 및 중재(Dispute Resolution) 관할지 체크
    
    [출력 포맷 JSON]
    - summary: 계약서 전체 리스크 요약
    - risks: [ {{{{ clause: "조항명", level: "HIGH/MID/LOW", reason: "위험 이유", counter_clause: "반박 및 수정 제안 문구" }}}} ]
    """
    
    response = client.models.generate_content(
        model='gemini-3.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )
    
    return response.text`,
    creatorName: '이지혜 대리',
    creatorDept: '화학영업2팀 & 화학법무지원TF',
    creatorContact: 'jh.lee@hyundaicorp.com / 사내 메신저: jh_chem',
    likes: 38,
    likedBy: ['emp-001', 'emp-004', 'emp-007', 'emp-012'],
    views: 245,
    badge: 'excellent',
    createdAt: '2026-06-20T11:30:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=400',
    emojiReactions: {
      '👍': ['emp-005', 'emp-007', 'emp-015'],
      '💡': ['emp-002', 'emp-008', 'emp-011', 'emp-012', 'emp-013'],
      '👏': ['emp-003', 'emp-010']
    }
  },
  {
    id: 'agent-3',
    name: '글로벌 통상 규제 & 관세율 모니터링 봇',
    category: 'report',
    shortDesc: '주요 교역국(미국, EU, 중국)의 철강/에너지 부문 최신 반덤핑 관세, ESG 탄소세(CBAM) 뉴스 및 규제를 매일 수집하여 맞춤형 아침 보고서를 자동 작성합니다.',
    painPoint: '보호무역주의 기조 확대로 관세 규제가 복잡해졌으나, 수많은 해외 정보원과 관세청 공시 자료를 매일 일일이 리서치하는 데 너무 많은 시간과 에너지가 소모되고 누락 가능성도 높습니다.',
    expectation: '데일리 리서치 시간 90% 이상 감축(매일 1시간 -> 5분), 주요 통상 리스크에 대한 선제적 실무 대응 및 시나리오 대비 가능.',
    features: [
      '미국 상무부(DOC) 및 EU 위원회 철강 관세 속보 자동 분류',
      'CBAM(탄소국경조정제도) 적합성 자가진단 및 신고서 항목 가이드라인 제공',
      '사내 주요 영업팀 맞춤형 실시간 알림 텍스트 요약본 생성'
    ],
    steps: [
      '에이전트에 관심 있는 수출 품목의 HS Code(6자리 이상)와 목표 국가를 선택합니다.',
      '최근 24시간 동안 발표된 미국 상무부(USDOC), EU 관보, 무역협회 등의 법적 공시 자료를 요약 분석합니다.',
      '해당 품목에 부과될 수 있는 기본 관세 및 긴급 수입제한조치(세이프가드) 리스크를 평가합니다.',
      '보고서 형식으로 다운로드하여 아침 미팅 및 유관 부서 회람용으로 사용합니다.'
    ],
    prompt: `import axios from 'axios';
import * as cheerio from 'cheerio';

interface TradeAlert {
  title: string;
  country: string;
  category: string;
  url: string;
  date: string;
}

export async function scrapeUSDOCTariffs(): Promise<TradeAlert[]> {
  const url = 'https://www.trade.gov/press-releases';
  const alerts: TradeAlert[] = [];
  
  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const $ = cheerio.load(data);
    
    $('.views-row').each((_, element) => {
      const titleText = $(element).find('.field-content a').text().trim();
      const link = 'https://www.trade.gov' + $(element).find('.field-content a').attr('href');
      const dateText = $(element).find('.datetime').text().trim();
      
      // 철강(Steel) 또는 반덤핑(Anti-dumping) 관련 뉴스 필터링
      if (/steel|antidumping|countervailing|tariff/i.test(titleText)) {
        alerts.push({
          title: titleText,
          country: 'USA',
          category: 'Tariff & Regulation',
          url: link,
          date: dateText
        });
      }
    });
    
    return alerts;
  } catch (error) {
    console.error('US DOC Tariff Scraper Failed:', error);
    return [];
  }
}`,
    creatorName: '박민수 차장',
    creatorDept: '글로벌경제전략실 정책조사팀',
    creatorContact: 'ms.park@hyundaicorp.com / 사내 메신저: ms_trade',
    likes: 54,
    likedBy: ['emp-001', 'emp-002', 'emp-003', 'emp-006', 'emp-008', 'emp-015'],
    views: 421,
    badge: 'best_month',
    createdAt: '2026-06-10T08:15:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=400',
    emojiReactions: {
      '👍': ['emp-001', 'emp-003', 'emp-005', 'emp-007'],
      '🔥': ['emp-002', 'emp-006', 'emp-009', 'emp-012', 'emp-015'],
      '💡': ['emp-004', 'emp-010', 'emp-011']
    }
  },
  {
    id: 'agent-4',
    name: '기계설비 견적 자동 산출 및 영문 제안서 빌더',
    category: 'analysis',
    shortDesc: '파트너사별 복잡한 부품 단가표를 대조하여 환율 및 타겟 마진 변동성을 시뮬레이션하고, 바이어 맞춤형 영문 오퍼 시트(Offer Sheet)를 즉시 빌드합니다.',
    painPoint: '해외 바이어 스펙에 맞춰 수십 가지 기계 부품 견적을 낼 때, 제조사별 가격표(엑셀)를 대조해가며 다차원 연산하느라 단가 실수가 간혹 발생하고, 견적서 송부까지 꼬박 이틀이 소요됩니다.',
    expectation: '견적 산출 및 영문 오퍼시트 작성 시간 단축 (2일 -> 15분), 기계 사양별 단가 수식 오류 제로화.',
    features: [
      '바이어 부품 요청 목록(Spec Sheet)과 제조사 원가 DB 매칭',
      '실시간 환율 변동 및 운송 부대비용 반영 마진 시뮬레이션',
      '국제 무역 표준 규격에 맞춘 영문 견적서(Offer Sheet) 마크다운 자동 생성'
    ],
    steps: [
      '에이전트에 바이어 요구 사양 목록을 텍스트 또는 표 형태로 입력합니다.',
      '기본 원가 기준 마진 비율과 환율을 조절하여 전체 견적가를 실시간 튜닝합니다.',
      '인코텀즈 조건(예: FOB, CIF, CFR)과 결제 방식(L/C, T/T)을 세팅합니다.',
      '에이전트가 완벽히 포맷팅된 영문 오퍼 시트를 생성하면, "복사"하여 이메일 또는 견적 시스템에 붙여넣습니다.'
    ],
    prompt: `interface PartsCost {
  partNumber: string;
  baseCostUSD: number;
  weightKg: number;
  leadTimeWeeks: number;
}

interface QuotationConfig {
  markupRate: number;      // 예: 0.15 (15%)
  exchangeRate: number;    // 예: 1350.0 (USD/KRW)
  shippingCostPerKg: number; // KG당 운송비 (USD)
  incoterms: 'FOB' | 'CIF' | 'CFR';
}

export function generateOfferSheet(
  buyerName: string,
  requestedSpecs: Array<{ partNumber: string; qty: number }>,
  vendorDb: Record<string, PartsCost>,
  config: QuotationConfig
) {
  let totalCostUSD = 0;
  let totalWeightKg = 0;
  const itemsList = [];

  for (const req of requestedSpecs) {
    const part = vendorDb[req.partNumber];
    if (!part) continue;

    const unitCostUSD = part.baseCostUSD;
    const unitPriceUSD = unitCostUSD * (1 + config.markupRate);
    const itemTotalUSD = unitPriceUSD * req.qty;

    totalCostUSD += itemTotalUSD;
    totalWeightKg += part.weightKg * req.qty;

    itemsList.push({
      partNumber: req.partNumber,
      qty: req.qty,
      unitPriceUSD,
      totalUSD: itemTotalUSD,
      leadTime: part.leadTimeWeeks
    });
  }

  // CIF 혹은 CFR 조건일 경우 해상 운송비 가산
  let shippingFreightUSD = 0;
  if (config.incoterms === 'CIF' || config.incoterms === 'CFR') {
    shippingFreightUSD = totalWeightKg * config.shippingCostPerKg;
  }

  const finalOfferAmountUSD = totalCostUSD + shippingFreightUSD;
  const finalOfferAmountKRW = finalOfferAmountUSD * config.exchangeRate;

  return {
    buyer: buyerName,
    items: itemsList,
    totalWeightKg,
    shippingFreightUSD,
    grandTotalUSD: finalOfferAmountUSD,
    grandTotalKRW: finalOfferAmountKRW,
    terms: \`INCOTERMS 2020: \${config.incoterms}, Validity: 15 Days, Origin: South Korea\`
  };
}`,
    creatorName: '최진우 과장',
    creatorDept: '기계수출사업부 기계2팀',
    creatorContact: 'jw.choi@hyundaicorp.com / 사내 메신저: jw_machinery',
    likes: 29,
    likedBy: ['emp-004', 'emp-005', 'emp-009', 'emp-011'],
    views: 189,
    badge: 'creative',
    createdAt: '2026-06-25T14:20:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400',
    emojiReactions: {
      '👍': ['emp-004', 'emp-006', 'emp-008'],
      '💡': ['emp-002', 'emp-009', 'emp-011', 'emp-013'],
      '👏': ['emp-010', 'emp-015']
    }
  },
  {
    id: 'agent-5',
    name: '인도네시아/인도 석탄 광물 시세 예측 및 마진 분석기',
    category: 'prediction',
    shortDesc: '런던금속거래소(LME) 원자재 시세, 인도네시아 고시 광물가격(HBA) 추이를 머신러닝 시나리오와 연동하여 트레이딩 마진 및 거래 리스크를 예측합니다.',
    painPoint: '글로벌 석탄 및 자원 시세는 중국의 수입 제한이나 글로벌 원자재 지수에 극도로 밀접해 마진 변동 폭이 큽니다. 예측치 수동 산출 시 소요 시간이 너무 길고 타이밍을 놓쳐 매입 리스크가 가중됩니다.',
    expectation: '최적 매입 시점 도출을 통한 광물 트레이딩 분기 마진율 평균 2.8% 개선 및 재고 리스크 최소화.',
    features: [
      'LME 시세 및 인도네시아 석탄가격지수(HBA) 복합 상관분석',
      '환율 변동 및 수입 관세, 선박 덤핑 요율 자동 합산 마진율 계산',
      '글로벌 수급 지표에 따른 가격 상/하방 3가지 시나리오(S, A, B) 대시보드 리포팅'
    ],
    steps: [
      '에이전트 시뮬레이터에서 분석할 타겟 광물(석탄/동광/철광석 등)을 정합니다.',
      '현재 주차 기준의 LME 가격 및 주요 부대비용(FOB 기준 운임 등) 변수값을 세팅합니다.',
      'AI가 최근 10년간의 가격 패턴 데이터베이스와 대조하여 예측 그래프 데이터와 밴드를 산출합니다.',
      '시나리오별 마진율 예측 테이블을 분석 자료에 활용하거나 메신저 보고용 브리핑 텍스트를 복사합니다.'
    ],
    prompt: `def calculate_coal_trading_margin(
    hba_index: float,
    base_purchase_price: float,
    freight_rate_per_ton: float,
    royalty_rate: float,
    insurance_rate: float,
    selling_price_per_ton: float
) -> dict:
    """
    인도네시아 고시 광물가격(HBA) 기준 트레이딩 세후 마진 및 시뮬레이터
    - HBA 인덱스 연동 정부 로열티(Royalty) 자동 반영
    """
    # 1. 정부 로열티 계산 (HBA 기준 가액에 연동되는 비율 적용)
    calculated_royalty = hba_index * royalty_rate
    
    # 2. 총 원가 산출 (광산 매입 단가 + 정부 로열티 + 운임 + 보험료)
    total_cost = base_purchase_price + calculated_royalty + freight_rate_per_ton + insurance_rate
    
    # 3. 톤당 마진 및 마진율 산출
    net_margin_per_ton = selling_price_per_ton - total_cost
    margin_percentage = (net_margin_per_ton / selling_price_per_ton) * 100
    
    # 4. 상/하방 가격 시나리오별 민감도 분석
    scenarios = {
        "Optimistic (+10% Price)": {
            "net_margin": net_margin_per_ton + (selling_price_per_ton * 0.10),
            "margin_pct": ((net_margin_per_ton + (selling_price_per_ton * 0.10)) / (selling_price_per_ton * 1.10)) * 100
        },
        "Baseline": {
            "net_margin": net_margin_per_ton,
            "margin_pct": margin_percentage
        },
        "Pessimistic (-10% Price)": {
            "net_margin": net_margin_per_ton - (selling_price_per_ton * 0.10),
            "margin_pct": ((net_margin_per_ton - (selling_price_per_ton * 0.10)) / (selling_price_per_ton * 0.90)) * 100
        }
    }
    
    return {
        "calculated_royalty_per_ton": round(calculated_royalty, 2),
        "total_cost_per_ton": round(total_cost, 2),
        "net_margin_per_ton": round(net_margin_per_ton, 2),
        "margin_percentage": round(margin_percentage, 2),
        "scenarios": scenarios
    }`,
    creatorName: '정소민 대리',
    creatorDept: '에너지자원개발본부 자원영업팀',
    creatorContact: 'sm.jung@hyundaicorp.com / 사내 메신저: sm_coal',
    likes: 31,
    likedBy: ['emp-001', 'emp-003', 'emp-005', 'emp-008'],
    views: 195,
    badge: null,
    createdAt: '2026-06-28T16:00:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=400',
    emojiReactions: {
      '👍': ['emp-002', 'emp-004', 'emp-006'],
      '🔥': ['emp-001', 'emp-007', 'emp-011'],
      '👏': ['emp-008', 'emp-012']
    }
  },
  {
    id: 'agent-6',
    name: '글로벌 바이어 컴플레인 대응 다국어 영업 메일 에이전트',
    category: 'customer',
    shortDesc: '격앙된 해외 바이어의 불만이 담긴 이메일을 입력하면, 문맥을 분석해 핵심 쟁점을 도출하고 상대방 문화권 비즈니스 예절에 맞는 맞춤형 사과 및 협상 메일 초안을 작성합니다.',
    painPoint: '제품 품질 불량이나 선박 지연으로 바이어의 감정적인 이메일이 왔을 때, 즉각적이고 적절한 영문 톤 조절이 어려워 자칫 외교적 결례나 법적 분쟁으로 번질 수 있으며, 작성 시간이 많이 소요됩니다.',
    expectation: '격식 있는 대안 이메일 작성 소요시간 단축 (평균 2시간 -> 10분), 바이어 이탈 방지 및 클레임 해결률 향상.',
    features: [
      '컴플레인 원문 속 감정 강도(Anger Level) 및 3대 쟁점(납기, 퀄리티, 가격) 자동 식별',
      '상대방 문화권(영미권, 일본, 중국, 중동 등) 비즈니스 프로토콜에 매칭된 예의 톤 조정',
      '사내 규칙에 근거한 상호 윈-윈(Win-Win) 보상안 가이드라인 및 면책 조항 권장 초안 작성'
    ],
    steps: [
      '바이어에게 받은 메일 내용 전문을 붙여넣습니다.',
      '수출 품목 유형과 이번 클레임에 대한 우리 측의 귀책 유무(아군 과실 / 해운사 과실 / 천재지변 등)를 세팅합니다.',
      '대응책(전액 환불 / 부분 보상 / 대체재 신속 발송 / 법적 대응 등)의 수위를 설정합니다.',
      '선택한 언어별(영어, 일본어, 중국어, 아랍어 등)로 자동 완성된 정중한 이메일 초안을 복사하여 즉시 활용합니다.'
    ],
    prompt: `const { GoogleGenAI } = require("@google/genai");

async function generateResponseEmail(complainText, culture, remedyType) {
  /**
   * 바이어 컴플레인 해결 및 정중한 대응 메일 생성 엔진
   * - Google GenAI (Gemini 3.5 Flash) 및 다국어 비즈니스 프로토콜 활용
   */
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const systemPrompt = \`
  당신은 현대코퍼레이션의 베테랑 국제 무역 분쟁 전문 영업 컨설턴트입니다.
  다음 격앙된 바이어의 클레임 메일에 적합한 정중하고 외교적인 톤의 답장을 작성하십시오.
  
  [바이어 불만 이메일]
  "\${complainText}"
  
  [문화권 조건]
  - \${culture} (예: 미국식-직설적/신속대응, 일본식-극진히 정중하며 관계중심, 중동식-상호신뢰 강조)
  
  [제안하는 보상 옵션]
  - \${remedyType} (대체 품목 신속 발송 / 다음 주문 시 파격 할인 제공 / 부분 환불 등)
  
  비즈니스 예절을 준수하여 최고의 이메일 초안을 생성하십시오.
  \`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: systemPrompt,
  });

  return response.text;
}`,
    creatorName: '강태오 대리',
    creatorDept: '해외영업지원팀 중남미파트',
    creatorContact: 'to.kang@hyundaicorp.com / 사내 메신저: to_latin',
    likes: 47,
    likedBy: ['emp-001', 'emp-002', 'emp-004', 'emp-008', 'emp-010', 'emp-013'],
    views: 298,
    badge: 'excellent',
    createdAt: '2026-06-29T10:00:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=400',
    emojiReactions: {
      '👍': ['emp-001', 'emp-003', 'emp-005', 'emp-007', 'emp-009'],
      '🔥': ['emp-004', 'emp-011', 'emp-014'],
      '💡': ['emp-002', 'emp-006', 'emp-008', 'emp-012'],
      '👏': ['emp-010', 'emp-013', 'emp-015']
    }
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comment-1',
    agentId: 'agent-1',
    authorName: '이동준 부장',
    authorDept: '철강물류그룹',
    authorId: 'emp-101',
    content: '부트캠프에서 이런 엄청난 결과물이 나왔군요! 동남아 철강재 해송 단가 예측 오차가 크지 않다면 당장 다음 주 선적 계약부터 활용해보고 싶습니다. 물류그룹에서도 데이터 보강에 참여하겠습니다.',
    createdAt: '2026-06-16T11:20:00Z'
  },
  {
    id: 'comment-2',
    agentId: 'agent-1',
    authorName: '박소현 과장',
    authorDept: '철강2본부 남미팀',
    authorId: 'emp-102',
    content: '동남아 노선 말고 혹시 남미나 대서양 노선도 확장 계획이 있으신가요? 남미 쪽 해송 적체가 정말 심한데, 예측 모델이 추가된다면 현업에 엄청난 힘이 될 것 같습니다.',
    createdAt: '2026-06-17T03:45:00Z'
  },
  {
    id: 'comment-3',
    agentId: 'agent-2',
    authorName: '최예원 대리',
    authorDept: '준법지원팀',
    authorId: 'emp-103',
    content: '법무TF에서 직접 만드셔서 그런지 계약서 검토 핵심 리스크 포인트가 아주 잘 잡혀 있네요. 관할법원 관례 분석 부분은 저희 신입사원 법률 교육용 프롬프트로 추천하고 싶을 정도입니다.',
    createdAt: '2026-06-21T09:12:00Z'
  },
  {
    id: 'comment-4',
    agentId: 'agent-3',
    authorName: '장민우 상무',
    authorDept: '통상대외협력실',
    authorId: 'emp-104',
    content: '미국 탄소세 일정이 매번 연기되거나 기준이 흐릿해서 골머리였는데, 이 에이전트 하나 켜두고 아침마다 요약 브리핑을 받아보니 리서치 피로감이 훨씬 덜합니다. 인재개발팀에서 우수 에이전트로 선정할 만 하네요.',
    createdAt: '2026-06-12T02:00:00Z'
  },
  {
    id: 'comment-5',
    agentId: 'agent-6',
    authorName: 'Sarah Smith 과장',
    authorDept: '싱가포르지사 영업파트',
    authorId: 'emp-105',
    content: 'As a local branch manager, sometimes we get very emotional emails from clients. This agent provides professional, well-structured emails that calm the situation down. Highly recommended for regional offices!',
    createdAt: '2026-06-30T01:10:00Z'
  }
];

export const CATEGORY_LABELS: Record<string, string> = {
  report: '보고서 자동화',
  analysis: '데이터 분석/대시보드',
  prediction: '예측모델',
  customer: '고객응대',
  writing: '문서작성',
  etc: '기타'
};

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  report: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  analysis: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  prediction: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  customer: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  writing: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  etc: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' }
};

export const REACTION_EMOJIS = ['👍', '🔥', '💡', '👏', '❤️', '👀'];
