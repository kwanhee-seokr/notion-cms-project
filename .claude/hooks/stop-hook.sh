#!/bin/bash
# Claude Code Stop 훅 - 작업 완료 알림

# UTF-8 인코딩 설정
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# 디버그 로그 파일
DEBUG_LOG="/c/Users/user/.claude/workplace/claude-code_mastery/.claude/hooks/debug.log"
echo "$(date): stop-hook.sh 실행됨" >> "$DEBUG_LOG"

# 스크립트가 위치한 디렉토리 경로 구하기
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "$(date): SCRIPT_DIR=$SCRIPT_DIR" >> "$DEBUG_LOG"

# .env 파일에서 Slack 웹훅 URL 로드
if [ -f "$SCRIPT_DIR/.env" ]; then
    echo "$(date): .env 파일 로드: $SCRIPT_DIR/.env" >> "$DEBUG_LOG"
    source "$SCRIPT_DIR/.env"
elif [ -f "$CLAUDE_PROJECT_DIR/.claude/hooks/.env" ]; then
    echo "$(date): .env 파일 로드: $CLAUDE_PROJECT_DIR/.claude/hooks/.env" >> "$DEBUG_LOG"
    source "$CLAUDE_PROJECT_DIR/.claude/hooks/.env"
else
    echo "$(date): 오류 - .env 파일을 찾을 수 없습니다" >> "$DEBUG_LOG"
    exit 1
fi

# Slack 웹훅 URL 확인
echo "$(date): SLACK_WEBHOOK_URL 설정 여부: $([ -n \"$SLACK_WEBHOOK_URL\" ] && echo 'YES' || echo 'NO')" >> "$DEBUG_LOG"
if [ -z "$SLACK_WEBHOOK_URL" ]; then
    echo "$(date): 오류 - SLACK_WEBHOOK_URL이 비어있음" >> "$DEBUG_LOG"
    exit 1
fi

# stdin에서 JSON 입력 읽기 (타임아웃 설정)
echo "$(date): stdin 읽기 시작" >> "$DEBUG_LOG"
INPUT=$(timeout 2 cat 2>/dev/null || echo "{}")
echo "$(date): INPUT 내용: $INPUT" >> "$DEBUG_LOG"

# JSON 입력에서 필드 추출 (jq 사용)
# jq 설치 확인 (Chocolatey로 설치됨: jq-1.8.1)
if command -v jq &> /dev/null; then
    echo "$(date): jq 버전: $(jq --version)" >> "$DEBUG_LOG"
    HOOK_EVENT=$(echo "$INPUT" | jq -r '.hook_event_name // empty' 2>/dev/null)
    STOP_REASON=$(echo "$INPUT" | jq -r '.reason // empty' 2>/dev/null)
    SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty' 2>/dev/null)
else
    echo "$(date): 경고 - jq가 설치되지 않음, sed 사용" >> "$DEBUG_LOG"
    HOOK_EVENT=$(echo "$INPUT" | sed -n 's/.*"hook_event_name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')
    STOP_REASON=$(echo "$INPUT" | sed -n 's/.*"reason"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')
    SESSION_ID=""
fi

# 프로젝트 정보 추출
PROJECT_NAME=$(basename "$CLAUDE_PROJECT_DIR")
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# 메시지 생성 (이벤트 정보 기반)
if [ -n "$STOP_REASON" ]; then
    REASON="$STOP_REASON"
elif [ -n "$HOOK_EVENT" ]; then
    REASON="$HOOK_EVENT"
else
    REASON="Task Completed"
fi
echo "$(date): HOOK_EVENT: $HOOK_EVENT, REASON: $REASON" >> "$DEBUG_LOG"

# JSON payload 생성 및 Slack 전송 (영어 메시지)
echo "$(date): Slack 메시지 전송 시작" >> "$DEBUG_LOG"
PAYLOAD=$(printf '{"channel": "#ai_claude_notification", "username": "Claude Code", "text": ":white_check_mark: Claude Code Task Completed\n\nProject: %s\nStatus: %s\nTime: %s\n\nClaude Code has finished working.", "icon_emoji": ":white_check_mark:"}' "$PROJECT_NAME" "$REASON" "$TIMESTAMP")
echo "$(date): PAYLOAD: $PAYLOAD" >> "$DEBUG_LOG"

# curl 결과를 로깅하여 디버깅 (UTF-8 인코딩으로 전송)
CURL_RESULT=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST \
    -H "Content-Type: application/json; charset=utf-8" \
    -d "$PAYLOAD" \
    "$SLACK_WEBHOOK_URL" 2>&1)
echo "$(date): curl 결과: $CURL_RESULT" >> "$DEBUG_LOG"
echo "$(date): 스크립트 완료" >> "$DEBUG_LOG"
