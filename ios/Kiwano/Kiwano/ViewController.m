//
//  ViewController.m
//  Kiwano
//
//  Created by Pan, Peter on 6/23/14.
//  Copyright (c) 2014 Pan, Peter. All rights reserved.
//

#import "ViewController.h"

@interface ViewController ()
    @property (weak, nonatomic) IBOutlet UIWebView *kiwanoView;

@end

@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
	NSString *fullURL = @"http://horned-melon.appspot.com";
    NSURL *url = [NSURL URLWithString:fullURL];
    NSURLRequest *requestObj = [NSURLRequest requestWithURL:url];
    [_kiwanoView loadRequest:requestObj];
}

/*
- (BOOL)prefersStatusBarHidden {
    return YES;
}
*/

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
