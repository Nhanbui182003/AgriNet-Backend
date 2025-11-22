export enum ErrorCode {
	INTERNAL_SERVER_ERROR = 'Internal server error',
	UNAUTHORIZED = 'Unauthorized',
	INVALID_PERMISSION = 'Invalid permission',
	INCORRECT_EMAIL_PASSWORD = 'Incorrect email or password',
	USER_NOT_FOUND = 'User not found',
	EMAIL_EXISTS = 'Email already exists',
	USER_EXIST = 'User already exists',
	NOT_PERMITTED_ROLE = 'Not permitted role',
	USER_IN_ACTIVE = 'User in active',
	INCORRECT_CURRENT_PASSWORD = 'Incorrect current password',
	INVALID_OTP = 'Invalid OTP',
	EMAIL_NOT_FOUND = 'Email not found',

	POST_NOT_FOUND = 'Post not found',
	COMMENT_NOT_FOUND = 'Comment not found',
}
