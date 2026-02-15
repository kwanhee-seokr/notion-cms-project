# Claude Code Slack 알림 설정 가이드

이 문서는 Claude Code에서 Slack 알림을 설정하는 방법을 안내합니다.

## 사전 요구사항

### 1. jq 설치

JSON 파싱을 위해 `jq`가 필요합니다.

**Windows (Git Bash / MSYS2):**

```bash
# MSYS2 pacman 사용
pacman -S jq

# 또는 Chocolatey 사용
choco install jq

# 또는 Scoop 사용
scoop install jq
```

**macOS:**

```bash
brew install jq
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt-get install jq
```

**Linux (CentOS/RHEL):**

```bash
sudo yum install jq
```

### 2. curl 설치 확인

```bash
curl --version
```

대부분의 시스템에 기본 설치되어 있습니다.

---

## Slack 웹훅 설정

### 1단계: Slack 앱 생성

1. [Slack API](https://api.slack.com/apps) 페이지로 이동
2. **Create New App** 클릭
3. **From scratch** 선택
4. 앱 이름 입력 (예: "Claude Code 알림")
5. 워크스페이스 선택 후 **Create App** 클릭

### 2단계: Incoming Webhooks 활성화

1. 앱 설정 페이지에서 **Incoming Webhooks** 클릭
2. **Activate Incoming Webhooks**를 **On**으로 전환
3. 페이지 하단의 **Add New Webhook to Workspace** 클릭
4. 알림을 받을 채널 선택 (예: `#claude-code`)
5. **Allow** 클릭

### 3단계: 웹훅 URL 복사

생성된 웹훅 URL을 복사합니다. 형식:

```
https://hooks.slack.com/services/<TEAM_ID>/<BOT_ID>/<TOKEN>
```

### 4단계: .env 파일 설정

`.claude/hooks/.env` 파일을 열고 웹훅 URL을 설정합니다:

```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

> ⚠️ **보안 주의**: `.env` 파일을 `.gitignore`에 추가하여 웹훅 URL이 공개되지 않도록 하세요.

---

## 파일 구조

```
.claude/
├── hooks/
│   ├── .env                    # Slack 웹훅 URL (비공개)
│   ├── notification-hook.sh    # 권한 요청 알림 스크립트
│   ├── stop-hook.sh            # 작업 완료 알림 스크립트
│   └── SETUP_SLACK_HOOKS.md    # 이 가이드 문서
└── settings.local.json         # 훅 설정 파일
```

---

## 테스트 방법

### 스크립트 단독 테스트

```bash
# notification-hook.sh 테스트
echo '{"message":"테스트 알림입니다"}' | bash .claude/hooks/notification-hook.sh

# stop-hook.sh 테스트
echo '{"hook_event_name":"Stop"}' | bash .claude/hooks/stop-hook.sh
```

### 실제 동작 테스트

1. Claude Code 재시작
2. 권한이 필요한 명령 실행 (예: 파일 생성)
3. Slack 채널에서 알림 확인

---

## 트러블슈팅

### 1. "오류: .env 파일을 찾을 수 없습니다"

**원인**: `.env` 파일이 없거나 경로가 잘못됨

**해결**:

```bash
# .env 파일 존재 확인
ls -la .claude/hooks/.env

# 파일이 없으면 생성
echo 'SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL' > .claude/hooks/.env
```

### 2. "오류: SLACK_WEBHOOK_URL이 설정되지 않았습니다"

**원인**: `.env` 파일에 URL이 설정되지 않음

**해결**: `.env` 파일을 열고 실제 웹훅 URL로 교체

### 3. jq 명령을 찾을 수 없음

**원인**: jq가 설치되지 않음

**해결**: 위의 "jq 설치" 섹션 참조

### 4. curl 오류

**원인**: 네트워크 연결 문제 또는 웹훅 URL 오류

**해결**:

```bash
# 웹훅 URL 직접 테스트
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"테스트 메시지"}' \
  YOUR_WEBHOOK_URL
```

### 5. 권한 오류 (Permission denied)

**원인**: 스크립트 실행 권한 없음

**해결**:

```bash
chmod +x .claude/hooks/notification-hook.sh
chmod +x .claude/hooks/stop-hook.sh
```

### 6. 알림이 오지 않음

**확인 사항**:

1. Slack 앱이 해당 채널에 추가되어 있는지 확인
2. 웹훅 URL이 정확한지 확인
3. 채널 이름이 `#claude-code`인지 확인 (스크립트에서 하드코딩됨)

**채널 이름 변경**:
스크립트의 `"channel": "#claude-code"` 부분을 원하는 채널로 수정

---

## 알림 커스터마이징

### 채널 변경

각 스크립트에서 `"channel": "#claude-code"` 부분을 수정:

```bash
"channel": "#your-channel-name"
```

### 알림 메시지 수정

스크립트의 `PAYLOAD` 변수에서 `text` 내용을 수정하여 메시지 형식을 변경할 수 있습니다.

### 이모지 변경

- `notification-hook.sh`: `"icon_emoji": ":bell:"`
- `stop-hook.sh`: `"icon_emoji": ":white_check_mark:"`

사용 가능한 이모지: [Slack 이모지 치트시트](https://www.webfx.com/tools/emoji-cheat-sheet/)

---

## 보안 권장사항

1. **`.env` 파일 보호**: `.gitignore`에 추가

   ```
   .claude/hooks/.env
   ```

2. **웹훅 URL 재생성**: URL이 노출된 경우 Slack 앱 설정에서 새 웹훅 생성

3. **최소 권한 원칙**: 알림용 전용 채널 사용 권장

---

## 관련 링크

- [Claude Code Hooks 공식 문서](https://docs.anthropic.com/en/docs/claude-code/hooks)
- [Slack Incoming Webhooks 가이드](https://api.slack.com/messaging/webhooks)
- [jq 공식 문서](https://stedolan.github.io/jq/)
