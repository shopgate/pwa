clean:
		find . -name "*error.log" -type f -delete
		find . -name "*debug.log" -type f -delete

release:
		lerna publish --force-publish:libraries/*
