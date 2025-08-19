#!/bin/bash
cd /home/kavia/workspace/code-generation/news-explorer-8002-8011/news_feed_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

